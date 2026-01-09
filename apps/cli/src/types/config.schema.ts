import { z } from 'zod'

export const UserConfigSchema = z.object({
  github: z.object({
    owner: z.string().default('newkub'),
    repository: z.string().default('templates'),
    branch: z.string().default('main'),
    templatesPath: z.string().default('templates')
  }).optional(),
  customTemplates: z.record(z.string(), z.string().nullish()).optional(),
  defaultProjectName: z.string().default('my-project').optional(),
  autoConfirm: z.boolean().default(false).optional(),
  openBrowser: z.boolean().default(true).optional(),
  placeholders: z.object({
    projectName: z.string().default('my-awesome-project').optional(),
    submoduleUrl: z.string().default('https://github.com/user/repo').optional(),
    submodulePath: z.string().default('templates/my-submodule').optional()
  }).optional()
})

export type UserConfig = z.infer<typeof UserConfigSchema>
