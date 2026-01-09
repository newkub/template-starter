import { PromptService } from './prompt.service'
import { FileService } from './file.service'
import { joinPath, resolveFromCwd } from '../utils/path-utils'
import { formatUpdateSuccessMessage } from '../components'
import type { ResolvedConfig } from '../types/config'

export async function handleUpdateCommand(config: ResolvedConfig): Promise<void> {
  const selectedTemplate = await PromptService.selectTemplate('Select a template to update:', config)
  
  const templateDir = selectedTemplate
  const projectPath = resolveFromCwd(templateDir)
  
  if (!(await FileService.exists(projectPath))) {
    PromptService.log.error(`Template directory "${templateDir}" not found in current directory`)
    process.exit(1)
  }

  const shouldUpdate = await PromptService.confirmAction(
    `Update template "${selectedTemplate}"? This will overwrite existing files.`,
    config.autoConfirm
  )

  if (!shouldUpdate) {
    PromptService.log.info('Template update cancelled')
    process.exit(0)
  }

  await updateTemplate(selectedTemplate)
  
  PromptService.log.success(formatUpdateSuccessMessage(selectedTemplate))
}

async function updateTemplate(templateName: string): Promise<void> {
  const templateDir = templateName
  const rootDir = process.env.TEMPLATES_ROOT ? joinPath(process.cwd(), process.env.TEMPLATES_ROOT) : joinPath(process.cwd(), '../../..')
  const sourcePath = joinPath(rootDir, 'templates', templateDir)
  const targetPath = resolveFromCwd(templateDir)

  if (!(await FileService.exists(sourcePath))) {
    throw new Error(`Template source directory not found: ${sourcePath}`)
  }

  await FileService.copyDir(sourcePath, targetPath)
  PromptService.log.info(`Updated files in ${targetPath}`)
}
