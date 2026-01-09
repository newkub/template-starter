import { PromptService } from '../services/prompt.service'
import { SubmoduleService } from '../services/submodule.service'
import type { ResolvedConfig } from '../types/config'

export async function handleAddCommand(config: ResolvedConfig): Promise<void> {
  const url = await PromptService.getSubmoduleUrl(config)
  const path = await PromptService.getSubmodulePath(config)
  await SubmoduleService.add(url, path)
}
