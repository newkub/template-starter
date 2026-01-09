import { FileService } from './file.service'
import { joinPath } from '../utils/path-utils'
import type { Plugin, PluginRegistry, PluginContext } from '../types/plugin'
import { z } from 'zod'

const PluginSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string().optional(),
  hooks: z.object({
    preTemplateCreate: z.function().optional(),
    postTemplateCreate: z.function().optional(),
    preTemplateUpdate: z.function().optional(),
    postTemplateUpdate: z.function().optional(),
    preConfigSync: z.function().optional(),
    postConfigSync: z.function().optional(),
    customCommand: z.function().optional()
  }),
  enabled: z.boolean().optional()
})

export class PluginService {
  private static instance: PluginService
  private registryPath: string
  private pluginsPath: string

  private constructor() {
    const homeDir = process.env.HOME || process.env.USERPROFILE || ''
    this.registryPath = joinPath(homeDir, '.templates-plugins.json')
    this.pluginsPath = joinPath(homeDir, '.templates-plugins')
  }

  static getInstance(): PluginService {
    if (!PluginService.instance) {
      PluginService.instance = new PluginService()
    }
    return PluginService.instance
  }

  async getRegistry(): Promise<PluginRegistry> {
    if (!(await FileService.exists(this.registryPath))) {
      return { plugins: {}, enabledPlugins: [] }
    }

    try {
      const content = await FileService.readFile(this.registryPath)
      return JSON.parse(content) as PluginRegistry
    } catch {
      return { plugins: {}, enabledPlugins: [] }
    }
  }

  async getPlugin(name: string): Promise<Plugin | null> {
    const registry = await this.getRegistry()
    return registry.plugins[name] || null
  }

  async loadPlugin(name: string): Promise<Plugin | null> {
    const pluginPath = joinPath(this.pluginsPath, name, 'index.ts')

    if (!(await FileService.exists(pluginPath))) {
      return null
    }

    try {
      const _content = await FileService.readFile(pluginPath)
      const pluginModule = await import(`file://${pluginPath}`)
      const plugin = pluginModule.default || pluginModule.plugin

      const validated = PluginSchema.parse(plugin)
      return validated as Plugin
    } catch (error) {
      console.error(`Failed to load plugin ${name}:`, error)
      return null
    }
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    const registry = await this.getRegistry()
    registry.plugins[plugin.name] = plugin

    if (plugin.enabled !== false) {
      if (!registry.enabledPlugins.includes(plugin.name)) {
        registry.enabledPlugins.push(plugin.name)
      }
    }

    await this.saveRegistry(registry)
  }

  async unregisterPlugin(name: string): Promise<boolean> {
    const registry = await this.getRegistry()

    if (!registry.plugins[name]) {
      return false
    }

    delete registry.plugins[name]
    registry.enabledPlugins = registry.enabledPlugins.filter(p => p !== name)

    await this.saveRegistry(registry)
    return true
  }

  async enablePlugin(name: string): Promise<boolean> {
    const registry = await this.getRegistry()

    if (!registry.plugins[name]) {
      return false
    }

    if (!registry.enabledPlugins.includes(name)) {
      registry.enabledPlugins.push(name)
    }

    await this.saveRegistry(registry)
    return true
  }

  async disablePlugin(name: string): Promise<boolean> {
    const registry = await this.getRegistry()

    if (!registry.plugins[name]) {
      return false
    }

    registry.enabledPlugins = registry.enabledPlugins.filter(p => p !== name)

    await this.saveRegistry(registry)
    return true
  }

  async listPlugins(): Promise<Plugin[]> {
    const registry = await this.getRegistry()
    return Object.values(registry.plugins)
  }

  async getEnabledPlugins(): Promise<Plugin[]> {
    const registry = await this.getRegistry()
    return registry.enabledPlugins
      .map(name => registry.plugins[name])
      .filter((p): p is Plugin => p !== undefined)
  }

  async executeHook(hookName: keyof Plugin['hooks'], context: PluginContext): Promise<void> {
    const enabledPlugins = await this.getEnabledPlugins()

    for (const plugin of enabledPlugins) {
      const hook = plugin.hooks[hookName]
      if (typeof hook === 'function') {
        try {
          await hook(context)
        } catch (error) {
          console.error(`Error executing ${hookName} hook in plugin ${plugin.name}:`, error)
        }
      }
    }
  }

  async executePreTemplateCreate(context: PluginContext): Promise<void> {
    await this.executeHook('preTemplateCreate', context)
  }

  async executePostTemplateCreate(context: PluginContext): Promise<void> {
    await this.executeHook('postTemplateCreate', context)
  }

  async executePreTemplateUpdate(context: PluginContext): Promise<void> {
    await this.executeHook('preTemplateUpdate', context)
  }

  async executePostTemplateUpdate(context: PluginContext): Promise<void> {
    await this.executeHook('postTemplateUpdate', context)
  }

  async executePreConfigSync(context: PluginContext): Promise<void> {
    await this.executeHook('preConfigSync', context)
  }

  async executePostConfigSync(context: PluginContext): Promise<void> {
    await this.executeHook('postConfigSync', context)
  }

  async installPlugin(name: string, source: string): Promise<void> {
    const pluginDir = joinPath(this.pluginsPath, name)

    if (await FileService.exists(pluginDir)) {
      throw new Error(`Plugin ${name} is already installed`)
    }

    await Bun.$`mkdir -p ${pluginDir}`.quiet()

    if (source.startsWith('http')) {
      await Bun.$`git clone ${source} ${pluginDir}`.quiet()
    } else {
      await FileService.copyDir(source, pluginDir)
    }

    const plugin = await this.loadPlugin(name)
    if (!plugin) {
      throw new Error(`Failed to load plugin from ${source}`)
    }

    await this.registerPlugin(plugin)
  }

  async uninstallPlugin(name: string): Promise<boolean> {
    const registry = await this.getRegistry()

    if (!registry.plugins[name]) {
      return false
    }

    const pluginDir = joinPath(this.pluginsPath, name)

    if (await FileService.exists(pluginDir)) {
      await Bun.$`rm -rf ${pluginDir}`.quiet()
    }

    return await this.unregisterPlugin(name)
  }

  private async saveRegistry(registry: PluginRegistry): Promise<void> {
    await FileService.writeFile(this.registryPath, JSON.stringify(registry, null, 2))
  }
}
