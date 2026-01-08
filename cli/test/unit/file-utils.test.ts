import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fileUtils from '../../src/utils/file-utils'
import { log } from '@clack/prompts'

// Mock dependencies
vi.mock('@clack/prompts', () => ({
  log: {
    warn: vi.fn(),
  },
}))

describe('file-utils', () => {
  const mockBun = { $: vi.fn(), file: vi.fn(), write: vi.fn() }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('Bun', mockBun)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('copyDir', () => {
    it('should execute copy command successfully', async () => {
      const quiet = vi.fn().mockResolvedValue({ exitCode: 0 })
      vi.mocked(mockBun.$).mockReturnValue({ quiet } as any)
      await fileUtils.copyDir('src', 'dest')
      expect(mockBun.$).toHaveBeenCalled()
    })

    it('should throw an error if copy command fails', async () => {
      const stderr = Buffer.from('copy failed')
      const quiet = vi.fn().mockResolvedValue({ exitCode: 2, stderr })
      vi.mocked(mockBun.$).mockReturnValue({ quiet } as any)
      await expect(fileUtils.copyDir('src', 'dest')).rejects.toThrow('Failed to copy directory: copy failed')
    })
  })

  describe('updateProjectPackageJson', () => {
    it('should update package.json successfully', async () => {
      const mockPackageJson = { name: 'old', version: '1.0.0' }
      const mockFile = {
        exists: vi.fn().mockResolvedValue(true),
        text: vi.fn().mockResolvedValue(JSON.stringify(mockPackageJson)),
      }
      vi.mocked(mockBun.file).mockReturnValue(mockFile as any)

      await fileUtils.updateProjectPackageJson('/project', 'new-name')

      expect(mockBun.file).toHaveBeenCalledWith('/project/package.json')
      expect(mockBun.write).toHaveBeenCalledWith(
        '/project/package.json',
        JSON.stringify({ name: 'new-name', version: '0.0.0' }, null, 2)
      )
    })

    it('should log a warning if package.json does not exist', async () => {
      const mockFile = { exists: vi.fn().mockResolvedValue(false) }
      vi.mocked(mockBun.file).mockReturnValue(mockFile as any)

      await fileUtils.updateProjectPackageJson('/project', 'new-name')

      expect(log.warn).toHaveBeenCalledWith('Could not update package.json - this may be normal for some templates')
      expect(mockBun.write).not.toHaveBeenCalled()
    })
  })
})
