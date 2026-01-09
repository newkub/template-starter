import { cliConfig } from '../config/cli.config'
import { joinPath } from '../utils/path-utils'
import { existsSync, statSync } from 'fs'
import { log } from '@clack/prompts'

export class FileService {
  /**
   * Check if a file or directory exists
   */
  static async exists(path: string): Promise<boolean> {
    try {
      return existsSync(path)
    } catch {
      return false
    }
  }

  /**
   * Check if path is a file
   */
  static isFile(path: string): boolean {
    try {
      return statSync(path).isFile()
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
   * Copy a directory recursively from source to destination using Bun APIs
   */
  static async copyDir(src: string, dest: string): Promise<void> {
    try {
      await Bun.$`mkdir -p ${dest}`.quiet()

      const files = await this.readdir(src)

      for (const file of files) {
        const srcPath = joinPath(src, file)
        const destPath = joinPath(dest, file)

        if (this.isFile(srcPath)) {
          await this.copyFile(srcPath, destPath)
        } else {
          await this.copyDir(srcPath, destPath)
        }
      }
    } catch (error) {
      console.error('Error copying directory:', error)
      throw error
    }
  }

  /**
   * Update project package.json with new project name
   */
  static async updateProjectPackageJson(projectPath: string, projectName: string): Promise<void> {
    const packageJsonPath = joinPath(projectPath, 'package.json')
    
    try {
      const file = Bun.file(packageJsonPath)
      if (!(await file.exists())) {
        log.warn('Could not update package.json - this may be normal for some templates')
        return
      }
      
      const packageJsonContent = await file.text()
      const packageJson = JSON.parse(packageJsonContent)
      
      packageJson.name = projectName
      
      if (packageJson.version) {
        packageJson.version = '0.0.0'
      }
      
      await Bun.write(packageJsonPath, JSON.stringify(packageJson, null, 2))
    } catch (_error) {
      log.warn('Could not update package.json - this may be normal for some templates')
      console.debug('Error updating package.json:', _error)
    }
  }

  /**
   * Sync config files from template to current directory
   */
  static async syncConfig(templateName: string, templateMap: Record<string, string> = cliConfig.templateMap): Promise<{ syncedFiles: string[]; message: string }> {
    const templateDir = templateMap[templateName]
    if (!templateDir) {
      throw new Error(`Template "${templateName}" not found`)
    }

    const rootDir = process.env.TEMPLATES_ROOT ? joinPath(process.cwd(), process.env.TEMPLATES_ROOT) : joinPath(process.cwd(), '../../..')
    const sourcePath = joinPath(rootDir, 'templates', templateDir)
    const targetPath = process.cwd()

    if (!(await this.exists(sourcePath))) {
      throw new Error(`Template source directory not found: ${sourcePath}`)
    }

    const allFiles = await this.readdir(sourcePath)

    const templateFiles = allFiles.filter(file => {
      const fullPath = joinPath(sourcePath, file)
      return this.isFile(fullPath)
    })

    if (templateFiles.length === 0) {
      return { syncedFiles: [], message: 'No files found in template directory' }
    }

    for (const file of templateFiles) {
      const sourceFile = joinPath(sourcePath, file)
      const targetFile = joinPath(targetPath, file)
      
      await this.copyFile(sourceFile, targetFile)
    }

    return { 
      syncedFiles: templateFiles, 
      message: `Successfully synced ${templateFiles.length} files from template "${templateName}"` 
    }
  }
}