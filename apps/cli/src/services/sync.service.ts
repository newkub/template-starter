import { PromptService } from '../services/prompt.service'
import { FileService } from '../services/file.service'
import type { ResolvedConfig } from '../types/config'

export async function handleSyncCommand(config: ResolvedConfig, templateName?: string): Promise<void> {
  let selectedTemplate = templateName

  if (!selectedTemplate) {
    selectedTemplate = await PromptService.selectTemplate('Select a template to sync config files:', config)
  }
  
  const result = await FileService.syncConfig(selectedTemplate, config.templateMap)
  
  if (result.syncedFiles.length === 0) {
    PromptService.log.info(result.message)
  } else {
    PromptService.log.success(result.message)
    PromptService.log.info(`Synced files: ${result.syncedFiles.join(', ')}`)
  }
}
