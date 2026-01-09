import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runApp } from '../../src/app'
import { PromptService } from '../../src/services/prompt.service'
import { ConfigLoader } from '../../src/services/config-loader.service'
import { ConfigResolver } from '../../src/services/config-resolver.service'
import { openUrl } from '../../src/services/url.service'
import { FileService } from '../../src/services/file.service'
import { SubmoduleService } from '../../src/services/submodule.service'
import { joinPath, resolveFromCwd } from '../../src/utils/path-utils'

// Mock all dependencies for testing runApp logic in isolation
vi.mock('../../src/services/prompt.service')
vi.mock('../../src/services/config-loader.service')
vi.mock('../../src/services/config-resolver.service')
vi.mock('../../src/services/url.service')
vi.mock('../../src/services/file.service')
vi.mock('../../src/services/submodule.service')
vi.mock('../../src/utils/path-utils')
vi.mock('../../src/config/cli.config', () => ({
  cliConfig: {
    templateMap: {
      'my-config': 'my-config',
    },
    github: {
      owner: 'newkub',
      repository: 'templates',
      branch: 'main',
      templatesPath: 'templates'
    }
  },
}))

describe('runApp', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    // Mock path utils
    vi.mocked(joinPath).mockImplementation((...parts) => parts.join('/'))
    vi.mocked(resolveFromCwd).mockImplementation((...parts) => parts.join('/'))
    // Mock config loading
    vi.mocked(ConfigLoader.loadUserConfig).mockResolvedValue(null)
    vi.mocked(ConfigResolver.resolve).mockReturnValue({
      github: {
        owner: 'newkub',
        repository: 'templates',
        branch: 'main',
        templatesPath: 'templates'
      },
      templateMap: {
        'my-config': 'my-config',
        'next': 'next'
      },
      defaultProjectName: 'my-project',
      autoConfirm: false,
      openBrowser: true,
      placeholders: {
        projectName: 'my-awesome-project',
        submoduleUrl: 'https://github.com/user/repo',
        submodulePath: 'templates/my-submodule'
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle the `list` command', async () => {
    vi.mocked(PromptService.selectCommand).mockResolvedValue('list' as any)
    vi.mocked(PromptService.selectTemplate).mockResolvedValue('next' as any)
    await runApp()
    expect(openUrl).toHaveBeenCalledWith('https://github.com/newkub/templates/tree/main/templates/next')
  })

  it('should handle the `use` command', async () => {
    vi.mocked(PromptService.selectCommand).mockResolvedValue('use' as any)
    vi.mocked(PromptService.selectTemplate).mockResolvedValue('next' as any)
    vi.mocked(PromptService.getProjectName).mockResolvedValue('my-project')
    vi.mocked(PromptService.confirmAction).mockResolvedValue(true)
    // Mock exists for createTemplate: first for source, second for target
    vi.mocked(FileService.exists).mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    await runApp()
    expect(FileService.copyDir).toHaveBeenCalled()
    expect(PromptService.log.success).toHaveBeenCalledWith(expect.stringContaining('Successfully created project'))
  })

  it('should handle the `sync` command', async () => {
    vi.mocked(PromptService.selectCommand).mockResolvedValue('sync' as any)
    vi.mocked(PromptService.selectTemplate).mockResolvedValue('my-config' as any)
    vi.mocked(FileService.syncConfig).mockResolvedValue({ syncedFiles: ['file.txt'], message: 'Synced' })
    await runApp()
    expect(FileService.syncConfig).toHaveBeenCalledWith('my-config', expect.any(Object))
    expect(PromptService.log.success).toHaveBeenCalledWith('Synced')
  })

  it('should handle the `add` command', async () => {
    vi.mocked(PromptService.selectCommand).mockResolvedValue('add' as any)
        vi.mocked(PromptService.getSubmoduleUrl).mockResolvedValue('https://test.com')
    vi.mocked(PromptService.getSubmodulePath).mockResolvedValue('a/b')
    await runApp()
    expect(SubmoduleService.add).toHaveBeenCalledWith('https://test.com', 'a/b')
  })

  it('should handle the `update` command', async () => {
    vi.mocked(PromptService.selectCommand).mockResolvedValue('update' as any)
    vi.mocked(PromptService.selectTemplate).mockResolvedValue('next' as any)
    vi.mocked(PromptService.confirmAction).mockResolvedValue(true)
    vi.mocked(FileService.exists).mockResolvedValue(true)

    await runApp()

    expect(FileService.copyDir).toHaveBeenCalled()
    expect(PromptService.log.success).toHaveBeenCalledWith(expect.stringContaining('Successfully updated template'))
  })

  it('should handle the `remove` command', async () => {
    vi.mocked(PromptService.selectCommand).mockResolvedValue('remove' as any)
    vi.mocked(PromptService.getSubmodulePath).mockResolvedValue('my/submodule')

    await runApp()

    expect(SubmoduleService.remove).toHaveBeenCalledWith('my/submodule')
  })
})
