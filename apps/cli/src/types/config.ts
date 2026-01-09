import { z } from 'zod'
import type { TemplateName } from './template'
import { UserConfigSchema } from '../schemas/config.schema'

export type UserConfig = z.infer<typeof UserConfigSchema>

export interface ResolvedConfig {
  github: {
    owner: string
    repository: string
    branch: string
    templatesPath: string
  }
  templateMap: Record<TemplateName | string, string>
  defaultProjectName: string
  autoConfirm: boolean
  openBrowser: boolean
  placeholders: {
    projectName: string
    submoduleUrl: string
    submodulePath: string
  }
}
