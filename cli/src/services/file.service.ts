import type { TemplateName } from '../types/template'
import { cliConfig } from '../config/cli.config'

export class FileService {
  /**
   * Check if a file or directory exists
   */
  static async exists(path: string): Promise<boolean> {
    try {
      const file = Bun.file(path)
      return await file.exists()
    } catch {
      return false
    }
  }

  /**
   * Read a file as text
   */
  static async readFile(path: string): Promise<string> {
    const file = Bun.file(path)
    return await file.text()
  }

  /**
   * Write content to a file
   */
  static async writeFile(path: string, content: string | Blob): Promise<void> {
    await Bun.write(path, content)
  }

  /**
   * Copy a file from source to destination
   */
  static async copyFile(src: string, dest: string): Promise<void> {
    const srcFile = Bun.file(src)
    await Bun.write(dest, srcFile)
  }

  /**
   * Get list of files in a directory
   */
  static async readdir(path: string): Promise<string[]> {
    try {
      const result = await Bun.$`ls ${path}`.text()
      return result.trim().split('\n').filter(file => file.trim() !== '')
    } catch {
      return []
    }
  }

  /**
   * Get the root directory of the project
   */
  static getRootDir(): string {
    const currentDir = import.meta.dir
    return `${currentDir}/../../../..`
  }

  /**
   * Sync config files from template to current directory
   */
  static async syncConfig(templateName: TemplateName): Promise<{ syncedFiles: string[]; message: string }> {
    const templateDir = cliConfig.templateMap[templateName]
    if (!templateDir) {
      throw new Error(`Template "${templateName}" not found`)
    }

    const rootDir = this.getRootDir()
    const sourcePath = `${rootDir}/templates/${templateDir}`
    const targetPath = process.cwd()

    // Check if source template exists
    if (!(await this.exists(sourcePath))) {
      throw new Error(`Template source directory not found: ${sourcePath}`)
    }

    // Get list of files in the template directory
    const templateFiles = await this.readdir(sourcePath)

    // Get list of files in the current directory
    const currentFiles = await this.readdir(targetPath)

    // Find matching files
    const matchingFiles = templateFiles.filter(file => currentFiles.includes(file))

    if (matchingFiles.length === 0) {
      return { syncedFiles: [], message: 'No matching files found to sync' }
    }

    // Sync matching files
    for (const file of matchingFiles) {
      const sourceFile = `${sourcePath}/${file}`
      const targetFile = `${targetPath}/${file}`
      
      await this.copyFile(sourceFile, targetFile)
    }

    return { 
      syncedFiles: matchingFiles, 
      message: `Successfully synced ${matchingFiles.length} files from template "${templateName}"` 
    }
  }
}