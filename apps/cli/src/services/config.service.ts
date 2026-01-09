import { ConfigLoader } from './config-loader.service'
import { ConfigResolver } from './config-resolver.service'
import type { ResolvedConfig } from '../types/config'

export class ConfigService {
  private static instance: ConfigService
  private config: ResolvedConfig | null = null

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  async initialize(): Promise<void> {
    if (this.config) {
      return
    }

    const userConfig = await ConfigLoader.loadUserConfig(process.cwd())
    this.config = ConfigResolver.resolve(userConfig)
  }

  getConfig(): ResolvedConfig {
    if (!this.config) {
      throw new Error('ConfigService not initialized. Call initialize() first.')
    }
    return this.config
  }
}
