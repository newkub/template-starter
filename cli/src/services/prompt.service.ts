import { select, text, confirm, log, isCancel } from '@clack/prompts'
import type { TemplateName } from '../types/template'

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

  static async selectTemplate(message: string): Promise<TemplateName> {
    const templateOptions = Object.keys({
      'my-config': 'my-config',
      'monorepo': 'monorepo',
      'next': 'next',
      'nuxt': 'nuxt',
      'slidev': 'slidev',
      'tutorial': 'tutorial',
      'vite-react': 'vite-react',
      'vitepress': 'vitepress',
      'vscode-vue': 'vscode-vue'
    }).map(key => ({
      value: key,
      label: key,
    }))

    const selectedTemplate = await select({
      message,
      options: templateOptions,
    })

    await this.handleCancel(selectedTemplate)
    return String(selectedTemplate) as TemplateName
  }

  static async getProjectName(): Promise<string> {
    const projectName = await text({
      message: 'Enter project name:',
      placeholder: 'my-awesome-project',
      validate: (value) => {
        if (!value) return 'Project name is required'
        if (!/^[a-z0-9-_]+$/.test(value)) return 'Project name must be lowercase with only letters, numbers, dashes, and underscores'
      }
    })

    await this.handleCancel(projectName)
    return String(projectName)
  }

  static async confirmAction(message: string): Promise<boolean> {
    const result = await confirm({
      message
    })

    await this.handleCancel(result)
    return Boolean(result)
  }

  static async getSubmoduleUrl(): Promise<string> {
    const url = await text({
      message: 'Enter submodule repository URL:',
      placeholder: 'https://github.com/user/repo',
      validate: (value) => {
        if (!value) return 'URL is required'
        if (!value.startsWith('https://')) return 'Please enter a valid HTTPS URL'
      }
    })
    await this.handleCancel(url)
    return String(url)
  }

  static async getSubmodulePath(): Promise<string> {
    const path = await text({
      message: 'Enter submodule path:',
      placeholder: 'templates/my-submodule',
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