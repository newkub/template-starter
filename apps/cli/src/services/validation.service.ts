import { FileService } from './file.service'
import { joinPath } from '../utils/path-utils'
import { getTemplatesRoot } from '../utils/config-utils'
import type { ValidationResult, ValidationError, ValidationWarning, TemplateValidationRules, TemplateHealthStatus, HealthIssue } from '../types/validation'

export class ValidationService {
  private static instance: ValidationService

  private constructor() {}

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService()
    }
    return ValidationService.instance
  }

  async validateTemplate(templateName: string, rules?: TemplateValidationRules, templatesRoot?: string): Promise<ValidationResult> {
    const rootDir = getTemplatesRoot(templatesRoot)
    const templatePath = joinPath(rootDir, 'templates', templateName)

    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    if (!(await FileService.exists(templatePath))) {
      errors.push({
        path: templatePath,
        message: `Template directory "${templateName}" does not exist`,
        code: 'TEMPLATE_NOT_FOUND'
      })
      return { isValid: false, errors, warnings }
    }

    const validationRules: TemplateValidationRules = rules || this.getDefaultValidationRules()

    await this.validateRequiredFiles(templatePath, validationRules.requiredFiles || [], errors, warnings)
    await this.validateRequiredFolders(templatePath, validationRules.requiredFolders || [], errors, warnings)
    await this.validateConfigFiles(templatePath, validationRules.requiredConfigFiles || [], errors, warnings)
    await this.validateForbiddenPatterns(templatePath, validationRules.forbiddenPatterns || [], errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  async checkProjectHealth(templateName: string, projectPath?: string, templatesRoot?: string): Promise<TemplateHealthStatus> {
    const rootDir = getTemplatesRoot(templatesRoot)
    const templatePath = joinPath(rootDir, 'templates', templateName)
    const targetPath = projectPath || process.cwd()

    const issues: HealthIssue[] = []
    const suggestions: string[] = []

    const validationResult = await this.validateTemplate(templateName, undefined, templatesRoot)
    
    if (!validationResult.isValid) {
      validationResult.errors.forEach(error => {
        issues.push({
          severity: 'error',
          message: error.message,
          path: error.path,
          fixable: false
        })
      })
    }

    await this.checkConfigSync(templatePath, targetPath, issues, suggestions)
    await this.checkOutdatedFiles(templatePath, targetPath, issues, suggestions)
    await this.checkDependencies(templatePath, targetPath, issues, suggestions)

    return {
      templateName,
      isHealthy: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions,
      lastChecked: new Date().toISOString()
    }
  }

  private getDefaultValidationRules(): TemplateValidationRules {
    return {
      requiredFiles: ['package.json', 'README.md'],
      requiredFolders: ['src', 'app'],
      requiredConfigFiles: ['.gitignore', 'tsconfig.json'],
      forbiddenPatterns: ['node_modules', '.git', 'dist', 'build']
    }
  }

  private async validateRequiredFiles(templatePath: string, requiredFiles: string[], errors: ValidationError[], warnings: ValidationWarning[]): Promise<void> {
    for (const file of requiredFiles) {
      const filePath = joinPath(templatePath, file)
      if (!(await FileService.exists(filePath))) {
        warnings.push({
          path: filePath,
          message: `Required file "${file}" is missing`,
          code: 'REQUIRED_FILE_MISSING'
        })
      }
    }
  }

  private async validateRequiredFolders(templatePath: string, requiredFolders: string[], errors: ValidationError[], warnings: ValidationWarning[]): Promise<void> {
    for (const folder of requiredFolders) {
      const folderPath = joinPath(templatePath, folder)
      if (!(await FileService.exists(folderPath))) {
        warnings.push({
          path: folderPath,
          message: `Required folder "${folder}" is missing`,
          code: 'REQUIRED_FOLDER_MISSING'
        })
      }
    }
  }

  private async validateConfigFiles(templatePath: string, configFiles: string[], errors: ValidationError[], warnings: ValidationWarning[]): Promise<void> {
    for (const file of configFiles) {
      const filePath = joinPath(templatePath, file)
      if (!(await FileService.exists(filePath))) {
        warnings.push({
          path: filePath,
          message: `Config file "${file}" is missing`,
          code: 'CONFIG_FILE_MISSING'
        })
      } else {
        await this.validateConfigFile(filePath, errors, warnings)
      }
    }
  }

  private async validateConfigFile(filePath: string, errors: ValidationError[], _warnings: ValidationWarning[]): Promise<void> {
    try {
      const content = await FileService.readFile(filePath)
      if (content.trim().length === 0) {
        errors.push({
          path: filePath,
          message: 'Config file is empty',
          code: 'EMPTY_CONFIG_FILE'
        })
      }
    } catch {
      errors.push({
        path: filePath,
        message: 'Failed to read config file',
        code: 'CONFIG_READ_ERROR'
      })
    }
  }

  private async validateForbiddenPatterns(templatePath: string, patterns: string[], errors: ValidationError[], _warnings: ValidationWarning[]): Promise<void> {
    const files = await FileService.readdir(templatePath)

    for (const pattern of patterns) {
      if (files.includes(pattern)) {
        errors.push({
          path: joinPath(templatePath, pattern),
          message: `Forbidden pattern "${pattern}" found in template`,
          code: 'FORBIDDEN_PATTERN_FOUND'
        })
      }
    }
  }

  private async checkConfigSync(templatePath: string, projectPath: string, issues: HealthIssue[], suggestions: string[]): Promise<void> {
    const configFiles = ['.gitignore', 'tsconfig.json', 'package.json']

    for (const file of configFiles) {
      const templateConfigPath = joinPath(templatePath, file)
      const projectConfigPath = joinPath(projectPath, file)

      if (await FileService.exists(templateConfigPath) && await FileService.exists(projectConfigPath)) {
        const templateContent = await FileService.readFile(templateConfigPath)
        const projectContent = await FileService.readFile(projectConfigPath)

        if (templateContent !== projectContent) {
          issues.push({
            severity: 'warning',
            message: `Config file "${file}" is out of sync with template`,
            path: projectConfigPath,
            fixable: true
          })
          suggestions.push(`Run sync command to update "${file}" from template`)
        }
      }
    }
  }

  private async checkOutdatedFiles(templatePath: string, projectPath: string, issues: HealthIssue[], suggestions: string[]): Promise<void> {
    const templateFiles = await FileService.readdir(templatePath)
    const projectFiles = await FileService.readdir(projectPath)

    for (const file of templateFiles) {
      if (!projectFiles.includes(file) && file !== 'node_modules' && !file.startsWith('.')) {
        suggestions.push(`Consider adding "${file}" from template to your project`)
      }
    }
  }

  private async checkDependencies(templatePath: string, projectPath: string, issues: HealthIssue[], suggestions: string[]): Promise<void> {
    const templatePackagePath = joinPath(templatePath, 'package.json')
    const projectPackagePath = joinPath(projectPath, 'package.json')

    if (await FileService.exists(templatePackagePath) && await FileService.exists(projectPackagePath)) {
      try {
        const templatePackage = JSON.parse(await FileService.readFile(templatePackagePath))
        const projectPackage = JSON.parse(await FileService.readFile(projectPackagePath))

        const templateDeps = { ...templatePackage.dependencies, ...templatePackage.devDependencies }
        const projectDeps = { ...projectPackage.dependencies, ...projectPackage.devDependencies }

        for (const [dep, templateVersion] of Object.entries(templateDeps)) {
          const projectVersion = projectDeps[dep]
          if (!projectVersion) {
            suggestions.push(`Consider adding dependency "${dep}" to your project`)
          } else if (templateVersion !== projectVersion) {
            issues.push({
              severity: 'info',
              message: `Dependency "${dep}" version differs from template`,
              fixable: false
            })
          }
        }
      } catch {
      }
    }
  }
}
