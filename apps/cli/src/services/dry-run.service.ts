import { FileService } from './file.service'
import { joinPath } from '../utils/path-utils'
import { getTemplatesRoot } from '../utils/config-utils'
import type { TemplatePreview } from './preview.service'
import { PreviewService } from './preview.service'
import { log } from '@clack/prompts'

export interface DryRunResult {
  templateName: string
  projectName: string
  preview: TemplatePreview
  filesToCreate: FileOperation[]
  estimatedSize: string
  warnings: string[]
  conflicts: FileConflict[]
}

export interface FileOperation {
  type: 'create' | 'overwrite' | 'skip'
  path: string
  size?: string
  reason?: string
}

export interface FileConflict {
  path: string
  action: 'overwrite' | 'skip' | 'rename'
  reason: string
}

export class DryRunService {
  private static instance: DryRunService

  private constructor() {}

  static getInstance(): DryRunService {
    if (!DryRunService.instance) {
      DryRunService.instance = new DryRunService()
    }
    return DryRunService.instance
  }

  async dryRunTemplate(templateName: string, projectName: string, templatesRoot?: string): Promise<DryRunResult> {
    const previewService = PreviewService.getInstance()
    const preview = await previewService.previewTemplate(templateName, templatesRoot)

    const rootDir = getTemplatesRoot(templatesRoot)
    const templatePath = joinPath(rootDir, 'templates', templateName)
    const targetPath = joinPath(process.cwd(), projectName)

    const filesToCreate = await this.analyzeFileOperations(templatePath, targetPath)
    const conflicts = await this.detectConflicts(templatePath, targetPath)
    const warnings = this.generateWarnings(conflicts, filesToCreate)
    const estimatedSize = await this.estimateSize(filesToCreate)

    return {
      templateName,
      projectName,
      preview,
      filesToCreate,
      estimatedSize,
      warnings,
      conflicts
    }
  }

  async displayDryRun(result: DryRunResult): Promise<void> {
    log.info('\n🔍 Dry Run Results')
    log.info('='.repeat(50))

    log.info(`\n📦 Template: ${result.templateName}`)
    log.info(`📁 Project: ${result.projectName}`)
    log.info(`📊 Estimated Size: ${result.estimatedSize}`)

    log.info('\n📄 File Operations:')
    const createCount = result.filesToCreate.filter(f => f.type === 'create').length
    const overwriteCount = result.filesToCreate.filter(f => f.type === 'overwrite').length
    const skipCount = result.filesToCreate.filter(f => f.type === 'skip').length

    log.info(`   Create: ${createCount} files`)
    log.info(`   Overwrite: ${overwriteCount} files`)
    log.info(`   Skip: ${skipCount} files`)

    if (result.conflicts.length > 0) {
      log.info('\n⚠️  Conflicts:')
      result.conflicts.forEach(conflict => {
        log.info(`   ${conflict.path} - ${conflict.reason}`)
      })
    }

    if (result.warnings.length > 0) {
      log.info('\n⚡ Warnings:')
      result.warnings.forEach(warning => {
        log.info(`   - ${warning}`)
      })
    }

    log.info('\n📋 Files to be created:')
    result.filesToCreate.slice(0, 20).forEach(op => {
      const icon = op.type === 'create' ? '✅' : op.type === 'overwrite' ? '🔄' : '⏭️'
      log.info(`   ${icon} ${op.path}${op.size ? ` (${op.size})` : ''}`)
    })

    if (result.filesToCreate.length > 20) {
      log.info(`   ... and ${result.filesToCreate.length - 20} more files`)
    }

    log.info('\n' + '='.repeat(50))
  }

  private async analyzeFileOperations(templatePath: string, targetPath: string): Promise<FileOperation[]> {
    const operations: FileOperation[] = []
    const files = await this.getAllFiles(templatePath, templatePath)

    for (const file of files) {
      const relativePath = file.replace(templatePath, '').replace(/^\//, '')
      const targetFilePath = joinPath(targetPath, relativePath)

      if (await FileService.exists(targetFilePath)) {
        operations.push({
          type: 'overwrite',
          path: relativePath,
          reason: 'File already exists'
        })
      } else {
        operations.push({
          type: 'create',
          path: relativePath
        })
      }
    }

    return operations
  }

  private async detectConflicts(templatePath: string, targetPath: string): Promise<FileConflict[]> {
    const conflicts: FileConflict[] = []

    if (await FileService.exists(targetPath)) {
      conflicts.push({
        path: targetPath,
        action: 'overwrite',
        reason: 'Project directory already exists'
      })
    }

    const files = await this.getAllFiles(templatePath, templatePath)

    for (const file of files) {
      const relativePath = file.replace(templatePath, '').replace(/^\//, '')
      const targetFilePath = joinPath(targetPath, relativePath)

      if (await FileService.exists(targetFilePath)) {
        const templateContent = await FileService.readFile(file)
        const targetContent = await FileService.readFile(targetFilePath)

        if (templateContent !== targetContent) {
          conflicts.push({
            path: relativePath,
            action: 'overwrite',
            reason: 'File content differs'
          })
        }
      }
    }

    return conflicts
  }

  private generateWarnings(conflicts: FileConflict[], operations: FileOperation[]): string[] {
    const warnings: string[] = []

    if (conflicts.length > 0) {
      warnings.push(`${conflicts.length} file(s) will be overwritten`)
    }

    const overwriteCount = operations.filter(o => o.type === 'overwrite').length
    if (overwriteCount > 5) {
      warnings.push(`Multiple files (${overwriteCount}) will be overwritten`)
    }

    const nodeModulesOp = operations.find(o => o.path.includes('node_modules'))
    if (nodeModulesOp) {
      warnings.push('node_modules directory will be copied (consider running install instead)')
    }

    return warnings
  }

  private async estimateSize(operations: FileOperation[]): Promise<string> {
    let totalSize = 0

    for (const op of operations) {
      if (op.type === 'create' || op.type === 'overwrite') {
        totalSize += 1024
      }
    }

    if (totalSize < 1024) {
      return `${totalSize} B`
    } else if (totalSize < 1024 * 1024) {
      return `${(totalSize / 1024).toFixed(2)} KB`
    } else {
      return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
    }
  }

  private async getAllFiles(dir: string, basePath: string): Promise<string[]> {
    const files: string[] = []
    const items = await FileService.readdir(dir)

    for (const item of items) {
      if (item === 'node_modules' || item === '.git') {
        continue
      }

      const fullPath = joinPath(dir, item)

      if (FileService.isFile(fullPath)) {
        files.push(fullPath)
      } else {
        const subFiles = await this.getAllFiles(fullPath, basePath)
        files.push(...subFiles)
      }
    }

    return files
  }
}
