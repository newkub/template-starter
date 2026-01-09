import { PromptService } from './prompt.service'

export class ErrorHandler {
  static async handleCommandError(error: unknown, commandName: string): Promise<never> {
    const message = error instanceof Error ? error.message : String(error)
    PromptService.log.error(`Failed to ${commandName}: ${message}`)
    process.exit(1)
  }

  static handleApplicationError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error)
    PromptService.log.error(`Application error: ${message}`)
    process.exit(1)
  }

  static handleUnknownCommand(command: string): never {
    PromptService.log.error(`Unknown command: ${command}`)
    process.exit(1)
  }
}
