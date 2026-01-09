import { PromptService } from './prompt.service'

export class SubmoduleService {
  static async add(url: string, path: string): Promise<void> {
    try {
      await Bun.$`git submodule add ${url} ${path}`.quiet()
      PromptService.log.success(`Submodule from ${url} added to ${path}`)
    } catch (error) {
      throw new Error(`Failed to add submodule: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async remove(path: string): Promise<void> {
    try {
      await Bun.$`git submodule deinit -f ${path}`.quiet()
      await Bun.$`git rm -f ${path}`.quiet()
      await Bun.$`rm -rf .git/modules/${path}`.quiet()
      PromptService.log.success(`Submodule at ${path} removed`)
    } catch (error) {
      throw new Error(`Failed to remove submodule: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
