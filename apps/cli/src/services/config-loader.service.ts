import { join } from 'node:path'
import { exists } from 'node:fs/promises'
import type { UserConfig } from '../types/config'

const CONFIG_FILE_NAMES = [
  '.templates-cli.json',
  '.templates-cli.config.ts',
  '.templates-cli.config.js',
  'templates-cli.config.ts',
  'templates-cli.config.js'
] as const

export class ConfigLoader {
  /**
   * Find and load user config file
   * Priority: .templates-cli.json > .templates-cli.config.ts/js
   */
  static async loadUserConfig(cwd: string): Promise<UserConfig | null> {
    for (const fileName of CONFIG_FILE_NAMES) {
      const configPath = join(cwd, fileName)
      
      if (await exists(configPath)) {
        try {
          const config = await this.importConfig(configPath, fileName)
          return config
        } catch (error) {
          console.warn(`Failed to load config from ${fileName}:`, error)
          return null
        }
      }
    }
    
    return null
  }

  /**
   * Import config file
   */
  private static async importConfig(configPath: string, fileName: string): Promise<UserConfig> {
    if (fileName.endsWith('.json')) {
      const file = Bun.file(configPath)
      const content = await file.text()
      return JSON.parse(content)
    }
    
    const module = await import(configPath)
    return module.default || module
  }
}
