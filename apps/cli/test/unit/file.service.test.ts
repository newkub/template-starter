import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FileService } from '../../src/services/file.service'
import { joinPath } from '../../src/utils/path-utils'

vi.mock('../../src/utils/path-utils')

describe('FileService.syncConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(joinPath).mockImplementation((...parts) => parts.join('/'))
    vi.spyOn(FileService, 'copyFile').mockResolvedValue(undefined)
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/current')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should sync matching files', async () => {
    const existsSpy = vi.spyOn(FileService, 'exists').mockResolvedValue(true)
    const readdirSpy = vi.spyOn(FileService, 'readdir')
      .mockResolvedValueOnce(['config.json', 'file1.txt'])
      .mockResolvedValueOnce(['config.json', 'other.js'])

    const result = await FileService.syncConfig('my-config')

    expect(existsSpy).toHaveBeenCalledWith(joinPath('/fake/root', 'templates', 'my-config'))
    expect(readdirSpy).toHaveBeenCalledTimes(2)
    expect(FileService.copyFile).toHaveBeenCalledWith(
      joinPath('/fake/root', 'templates', 'my-config', 'config.json'),
      joinPath('/fake/current', 'config.json')
    )
    expect(result.syncedFiles).toEqual(['config.json'])
  })

  it('should throw if template source directory does not exist', async () => {
    vi.spyOn(FileService, 'exists').mockResolvedValue(false)
    await expect(FileService.syncConfig('my-config')).rejects.toThrow('Template source directory not found')
  })

  it('should return a message if no matching files are found', async () => {
    vi.spyOn(FileService, 'exists').mockResolvedValue(true)
    vi.spyOn(FileService, 'readdir')
      .mockResolvedValueOnce(['file1.txt'])
      .mockResolvedValueOnce(['file2.txt'])

    const result = await FileService.syncConfig('my-config')

    expect(result.message).toBe('No files found in template directory')
    expect(FileService.copyFile).not.toHaveBeenCalled()
  })
})
