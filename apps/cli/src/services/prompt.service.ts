import { select, text, confirm, log, isCancel } from '@clack/prompts'
import type { ResolvedConfig } from '../types/config'

export class PromptService {
  static async handleCancel(value: unknown): Promise<void> {
    if (isCancel(value)) {
      process.exit(0)
    }
  }

  static async selectCommand(): Promise<string> {
    const command = await select({
      message: 'Select a command:',
      options: [
        { value: 'use', label: 'use', hint: 'Use a template to create a new project' },
        { value: 'list', label: 'list', hint: 'Show all available templates' },
        { value: 'update', label: 'update', hint: 'Update an existing template in place' },
        { value: 'sync', label: 'sync', hint: 'Sync config files from template to current directory' },
        { value: 'add', label: 'add', hint: 'Add a git submodule' },
        { value: 'remove', label: 'remove', hint: 'Remove a git submodule' }
      ]
    })

    await this.handleCancel(command)
    return String(command)
  }

  static async selectTemplate(message: string, config: ResolvedConfig): Promise<string> {
    const templateOptions = Object.keys(config.templateMap).map(key => ({
      value: key,
      label: key,
    }))

    const selectedTemplate = await select({
      message,
      options: templateOptions,
    })

    await this.handleCancel(selectedTemplate)
    return String(selectedTemplate)
  }

  static async getProjectName(config: ResolvedConfig, defaultName?: string): Promise<string> {
    const projectName = await text({
      message: 'Enter project name:',
      placeholder: defaultName || config.placeholders.projectName,
      validate: (value) => {
        if (!value) return 'Project name is required'
        if (!/^[a-z0-9-_]+$/.test(value)) return 'Project name must be lowercase with only letters, numbers, dashes, and underscores'
      }
    })

    await this.handleCancel(projectName)
    return String(projectName)
  }

  static async confirmAction(message: string, autoConfirm: boolean = false): Promise<boolean> {
    if (autoConfirm) {
      return true
    }

    const result = await confirm({
      message
    })

    await this.handleCancel(result)
    return Boolean(result)
  }

  static async getSubmoduleUrl(config: ResolvedConfig, defaultUrl?: string): Promise<string> {
    const url = await text({
      message: 'Enter submodule repository URL:',
      placeholder: defaultUrl || config.placeholders.submoduleUrl,
      validate: (value) => {
        if (!value) return 'URL is required'
        if (!value.startsWith('https://')) return 'Please enter a valid HTTPS URL'
      }
    })
    await this.handleCancel(url)
    return String(url)
  }

  static async getSubmodulePath(config: ResolvedConfig, defaultPath?: string): Promise<string> {
    const path = await text({
      message: 'Enter submodule path:',
      placeholder: defaultPath || config.placeholders.submodulePath,
      validate: (value) => {
        if (!value) return 'Path is required'
      }
    })
    await this.handleCancel(path)
    return String(path)
  }

  static log = {
    info: log.info,
    success: log.success,
    warn: log.warn,
    error: log.error
  }
}