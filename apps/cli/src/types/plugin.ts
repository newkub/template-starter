export interface Plugin {
  name: string
  version: string
  description: string
  author?: string
  hooks: PluginHooks
  enabled?: boolean
}

export interface PluginHooks {
  preTemplateCreate?: (context: PluginContext) => Promise<void>
  postTemplateCreate?: (context: PluginContext) => Promise<void>
  preTemplateUpdate?: (context: PluginContext) => Promise<void>
  postTemplateUpdate?: (context: PluginContext) => Promise<void>
  preConfigSync?: (context: PluginContext) => Promise<void>
  postConfigSync?: (context: PluginContext) => Promise<void>
  customCommand?: (context: PluginContext) => Promise<void>
}

export interface PluginContext {
  templateName: string
  projectName?: string
  version?: string
  config: Record<string, unknown>
  dryRun?: boolean
  metadata: Record<string, unknown>
}

export interface PluginRegistry {
  plugins: Record<string, Plugin>
  enabledPlugins: string[]
}

export interface CustomTemplate {
  name: string
  path: string
  version?: string | undefined
  description?: string | undefined
  author?: string | undefined
  isRemote?: boolean | undefined
  repositoryUrl?: string | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
