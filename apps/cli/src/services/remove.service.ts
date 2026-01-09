import { PromptService } from '../services/prompt.service'
import { SubmoduleService } from '../services/submodule.service'
import type { ResolvedConfig } from '../types/config'

export async function handleRemoveCommand(config: ResolvedConfig): Promise<void> {
  const path = await PromptService.getSubmodulePath(config)
  await SubmoduleService.remove(path)
}
