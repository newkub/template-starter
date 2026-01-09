import { FileService } from './file.service'
import { joinPath } from '../utils/path-utils'
import type { CustomTemplate } from '../types/plugin'
import { z } from 'zod'

const CustomTemplateSchema = z.object({
  name: z.string(),
  path: z.string(),
  version: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  isRemote: z.boolean().optional(),
  repositoryUrl: z.string().url().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export class RegistryService {
  private static instance: RegistryService
  private registryPath: string

  private constructor() {
    this.registryPath = joinPath(process.env.HOME || process.env.USERPROFILE || '', '.templates-registry.json')
  }

  static getInstance(): RegistryService {
    if (!RegistryService.instance) {
      RegistryService.instance = new RegistryService()
    }
    return RegistryService.instance
  }

  async getRegistry(): Promise<CustomTemplate[]> {
    if (!(await FileService.exists(this.registryPath))) {
      return []
    }

    try {
      const content = await FileService.readFile(this.registryPath)
      const data = JSON.parse(content)
      return z.array(CustomTemplateSchema).parse(data) as CustomTemplate[]
    } catch {
      return []
    }
  }

  async getTemplate(name: string): Promise<CustomTemplate | null> {
    const registry = await this.getRegistry()
    return registry.find(t => t.name === name) ?? null
  }

  async addTemplate(template: Omit<CustomTemplate, 'createdAt' | 'updatedAt'>): Promise<void> {
    const registry = await this.getRegistry()

    const existingIndex = registry.findIndex(t => t.name === template.name)
    const now = new Date().toISOString()

    const existingTemplate = existingIndex >= 0 ? registry[existingIndex] : undefined

    const newTemplate: CustomTemplate = {
      ...template,
      createdAt: existingTemplate?.createdAt ?? now,
      updatedAt: now
    }

    if (existingIndex >= 0) {
      registry[existingIndex] = newTemplate
    } else {
      registry.push(newTemplate)
    }

    await this.saveRegistry(registry)
  }

  async removeTemplate(name: string): Promise<boolean> {
    const registry = await this.getRegistry()
    const filtered = registry.filter(t => t.name !== name)

    if (filtered.length === registry.length) {
      return false
    }

    await this.saveRegistry(filtered)
    return true
  }

  async updateTemplate(name: string, updates: Partial<CustomTemplate>): Promise<boolean> {
    const registry = await this.getRegistry()
    const index = registry.findIndex(t => t.name === name)

    if (index < 0) {
      return false
    }

    const existing = registry[index]
    if (!existing) {
      return false
    }

    registry[index] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    await this.saveRegistry(registry)
    return true
  }

  async listTemplates(): Promise<CustomTemplate[]> {
    const registry = await this.getRegistry()
    return registry.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || '').getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || '').getTime()
      return dateB - dateA
    })
  }

  async searchTemplates(query: string): Promise<CustomTemplate[]> {
    const registry = await this.getRegistry()
    const lowerQuery = query.toLowerCase()

    return registry.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery) ||
      t.author?.toLowerCase().includes(lowerQuery)
    )
  }

  async validateTemplate(template: CustomTemplate): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (!template.name || template.name.trim().length === 0) {
      errors.push('Template name is required')
    }

    if (!template.path || template.path.trim().length === 0) {
      errors.push('Template path is required')
    } else if (!(await FileService.exists(template.path))) {
      errors.push(`Template path does not exist: ${template.path}`)
    }

    if (template.isRemote && !template.repositoryUrl) {
      errors.push('Remote templates must have a repository URL')
    }

    if (template.repositoryUrl && !this.isValidUrl(template.repositoryUrl)) {
      errors.push('Invalid repository URL')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  async importFromPath(path: string, name?: string): Promise<CustomTemplate> {
    const templateName = name || path.split(/[/\\]/).pop() || 'unnamed-template'

    if (!(await FileService.exists(path))) {
      throw new Error(`Path does not exist: ${path}`)
    }

    const template: CustomTemplate = {
      name: templateName,
      path,
      isRemote: false
    }

    await this.addTemplate(template)
    return template
  }

  async importFromUrl(url: string, name?: string): Promise<CustomTemplate> {
    const templateName = name || url.split('/').pop()?.replace('.git', '') || 'unnamed-template'

    const template: CustomTemplate = {
      name: templateName,
      path: url,
      isRemote: true,
      repositoryUrl: url
    }

    await this.addTemplate(template)
    return template
  }

  private async saveRegistry(registry: CustomTemplate[]): Promise<void> {
    await FileService.writeFile(this.registryPath, JSON.stringify(registry, null, 2))
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}
