import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SubmoduleService } from '../../src/services/submodule.service'
import { PromptService } from '../../src/services/prompt.service'

// Mock dependencies
vi.mock('../../src/services/prompt.service')

describe('SubmoduleService', () => {
  const mockShellPromise = { quiet: vi.fn() }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('Bun', { $: vi.fn(() => mockShellPromise) })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('add', () => {
    it('should call git submodule add and log success', async () => {
      vi.mocked(mockShellPromise.quiet).mockResolvedValue({ exitCode: 0 } as any)
      await SubmoduleService.add('url', 'path')
      expect(global.Bun.$).toHaveBeenCalledWith(['git submodule add ', ' ', ''], 'url', 'path')
      expect(PromptService.log.success).toHaveBeenCalledWith('Submodule from url added to path')
    })

    it('should throw an error if the command fails', async () => {
      const error = new Error('Git failed')
      vi.mocked(mockShellPromise.quiet).mockRejectedValue(error)
      await expect(SubmoduleService.add('url', 'path')).rejects.toThrow(`Failed to add submodule: ${error.message}`)
    })
  })

  describe('remove', () => {
    it('should call git submodule deinit/rm and log success', async () => {
      vi.mocked(mockShellPromise.quiet).mockResolvedValue({ exitCode: 0 } as any)
      await SubmoduleService.remove('path')
      expect(global.Bun.$).toHaveBeenCalledWith(['git submodule deinit -f ', ''], 'path')
      expect(global.Bun.$).toHaveBeenCalledWith(['git rm -f ', ''], 'path')
      expect(global.Bun.$).toHaveBeenCalledWith(['rm -rf .git/modules/', ''], 'path')
      expect(PromptService.log.success).toHaveBeenCalledWith('Submodule at path removed')
    })

    it('should throw an error if any command fails', async () => {
      const error = new Error('Git failed')
      vi.mocked(mockShellPromise.quiet).mockRejectedValueOnce(error)
      await expect(SubmoduleService.remove('path')).rejects.toThrow(`Failed to remove submodule: ${error.message}`)
    })
  })
})
