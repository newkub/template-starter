import { PromptService } from './prompt.service'
import { FileService } from './file.service'
import { joinPath, resolveFromCwd } from '../utils/path-utils'
import { formatUseSuccessMessage, formatNavigationInstructions } from '../components'
import type { ResolvedConfig } from '../types/config'

export async function handleUseCommand(config: ResolvedConfig): Promise<void> {
  const selectedTemplate = await PromptService.selectTemplate('Select a template to create:', config)
  const projectName = await PromptService.getProjectName(config, config.defaultProjectName)
  
  const shouldCreate = await PromptService.confirmAction(
    `Create project "${projectName}" using template "${selectedTemplate}"?`,
    config.autoConfirm
  )

  if (!shouldCreate) {
    PromptService.log.info('Template creation cancelled')
    process.exit(0)
  }

  await createTemplate(selectedTemplate, projectName)
  
  PromptService.log.success(formatUseSuccessMessage(selectedTemplate, projectName))
  PromptService.log.info(formatNavigationInstructions(projectName))
}

async function createTemplate(templateName: string, projectName: string): Promise<void> {
  const templateDir = templateName
  const rootDir = process.env.TEMPLATES_ROOT ? joinPath(process.cwd(), process.env.TEMPLATES_ROOT) : joinPath(process.cwd(), '../../..')
  const sourcePath = joinPath(rootDir, 'templates', templateDir)
  const targetPath = resolveFromCwd(projectName)

  if (!(await FileService.exists(sourcePath))) {
    throw new Error(`Template source directory not found: ${sourcePath}`)
  }

  if (await FileService.exists(targetPath)) {
    const shouldOverwrite = await PromptService.confirmAction(
      `Directory "${projectName}" already exists. Overwrite?`
    )
    
    if (!shouldOverwrite) {
      throw new Error('Project directory already exists')
    }
  }

  await FileService.copyDir(sourcePath, targetPath)
  await FileService.updateProjectPackageJson(targetPath, projectName)
}
