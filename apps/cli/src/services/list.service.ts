import { PromptService } from './prompt.service'
import { openUrl } from './url.service'
import type { ResolvedConfig } from '../types/config'

export async function handleListCommand(config: ResolvedConfig): Promise<void> {
  const selectedTemplate = await PromptService.selectTemplate('Available templates:', config)
  
  const githubUrl = `https://github.com/${config.github.owner}/${config.github.repository}/tree/${config.github.branch}/${config.github.templatesPath}/${selectedTemplate}`
  
  PromptService.log.info(`Opening GitHub page for template: ${selectedTemplate}`)
  PromptService.log.info(`URL: ${githubUrl}`)
  
  if (config.openBrowser) {
    await openUrl(githubUrl)
  } else {
    PromptService.log.info(`URL: ${githubUrl}`)
  }
}
