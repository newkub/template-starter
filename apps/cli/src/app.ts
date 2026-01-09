#!/usr/bin/env bun

import { ConfigService } from './services/config.service'
import { PromptService } from './services/prompt.service'
import { ErrorHandler } from './services/error-handler.service'
import * as services from './services'

export async function runApp(command?: string, templateName?: string): Promise<void> {
  const configService = ConfigService.getInstance()
  await configService.initialize()

  const config = configService.getConfig()
  PromptService.log.info('Templates CLI')

  try {
    let selectedCommand = command

    if (!selectedCommand) {
      selectedCommand = await PromptService.selectCommand()
    }

    switch (selectedCommand) {
      case 'use':
        await services.handleUseCommand(config)
        break
      case 'list':
        await services.handleListCommand(config)
        break
      case 'update':
        await services.handleUpdateCommand(config)
        break
      case 'sync':
        await services.handleSyncCommand(config, templateName)
        break
      case 'add':
        await services.handleAddCommand(config)
        break
      case 'remove':
        await services.handleRemoveCommand(config)
        break
      default:
        ErrorHandler.handleUnknownCommand(selectedCommand)
    }
  } catch (error) {
    ErrorHandler.handleApplicationError(error)
  }
}

export function getConfig() {
  return ConfigService.getInstance().getConfig()
}