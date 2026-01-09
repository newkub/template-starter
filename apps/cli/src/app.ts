#!/usr/bin/env bun

import { FileService } from './services/file.service'
import { SubmoduleService } from './services/submodule.service'
import { PromptService } from './services/prompt.service'
import { ConfigLoader } from './services/config-loader.service'
import { ConfigResolver } from './services/config-resolver.service'
import { formatUseSuccessMessage, formatUpdateSuccessMessage, formatNavigationInstructions } from './components/index'
import { copyDir, updateProjectPackageJson } from './utils/file-utils'
import { openUrl } from './utils/url-utils'
import { pathUtils } from './utils/path-utils'
import type { ResolvedConfig } from './types/config'

let resolvedConfig: ResolvedConfig

/**
 * Initialize configuration
 */
async function initConfig(): Promise<void> {
  const userConfig = await ConfigLoader.loadUserConfig(process.cwd())
  resolvedConfig = ConfigResolver.resolve(userConfig)
}

/**
 * Get resolved config
 */
export function getConfig(): ResolvedConfig {
  return resolvedConfig
}

/**
 * Main application function that handles the CLI logic
 */
export async function runApp(): Promise<void> {
  await initConfig()

  PromptService.log.info('Templates CLI')

  try {
    const command = await PromptService.selectCommand()

    switch (command) {
      case 'use':
        await handleUseCommand()
        break
      case 'list':
        await handleListCommand()
        break
      case 'update':
        await handleUpdateCommand()
        break
      case 'sync':
        await handleSyncCommand()
        break
      case 'add':
        await handleAddCommand()
        break
      case 'remove':
        await handleRemoveCommand()
        break
      default:
        PromptService.log.error(`Unknown command: ${command}`)
        process.exit(1)
    }
  } catch (error) {
    PromptService.log.error(`Application error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Handle the create command
 */
async function handleUseCommand(): Promise<void> {
  try {
    const selectedTemplate = await PromptService.selectTemplate('Select a template to create:', resolvedConfig)
    const projectName = await PromptService.getProjectName(resolvedConfig, resolvedConfig.defaultProjectName)
    
    const shouldCreate = await PromptService.confirmAction(
      `Create project "${projectName}" using template "${selectedTemplate}"?`,
      resolvedConfig.autoConfirm
    )

    if (!shouldCreate) {
      PromptService.log.info('Template creation cancelled')
      process.exit(0)
    }

    // Create the template
    await createTemplate(selectedTemplate, projectName)
    
    PromptService.log.success(formatUseSuccessMessage(selectedTemplate, projectName))
    PromptService.log.info(formatNavigationInstructions(projectName))
  } catch (error) {
    PromptService.log.error(`Failed to create template: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Handle the list command
 */
async function handleListCommand(): Promise<void> {
  try {
    const selectedTemplate = await PromptService.selectTemplate('Available templates:', resolvedConfig)
    
    // Construct GitHub URL for the selected template using config
    const githubUrl = `https://github.com/${resolvedConfig.github.owner}/${resolvedConfig.github.repository}/tree/${resolvedConfig.github.branch}/${resolvedConfig.github.templatesPath}/${selectedTemplate}`
    
    // Display the GitHub URL
    PromptService.log.info(`Opening GitHub page for template: ${selectedTemplate}`)
    PromptService.log.info(`URL: ${githubUrl}`)
    
    // Open the URL in the browser
    if (resolvedConfig.openBrowser) {
      await openUrl(githubUrl)
    } else {
      PromptService.log.info(`URL: ${githubUrl}`)
    }
  } catch (error) {
    PromptService.log.error(`Failed to list templates: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Handle the update command
 */
async function handleUpdateCommand(): Promise<void> {
  try {
    const selectedTemplate = await PromptService.selectTemplate('Select a template to update:', resolvedConfig)
    
    // Check if template exists in current directory
    const templateDir = selectedTemplate
    const projectPath = pathUtils.resolveFromCwd(templateDir)
    
    if (!(await FileService.exists(projectPath))) {
      PromptService.log.error(`Template directory "${templateDir}" not found in current directory`)
      process.exit(1)
    }

    const shouldUpdate = await PromptService.confirmAction(
      `Update template "${selectedTemplate}"? This will overwrite existing files.`,
      resolvedConfig.autoConfirm
    )

    if (!shouldUpdate) {
      PromptService.log.info('Template update cancelled')
      process.exit(0)
    }

    // Perform the update
    await updateTemplate(selectedTemplate)
    
    PromptService.log.success(formatUpdateSuccessMessage(selectedTemplate))
  } catch (error) {
    PromptService.log.error(`Failed to update template: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Handle the sync command
 */
async function handleSyncCommand(): Promise<void> {
  try {
    const selectedTemplate = await PromptService.selectTemplate('Select a template to sync config files:', resolvedConfig)
    
    // Perform the sync
    const result = await FileService.syncConfig(selectedTemplate, resolvedConfig.templateMap)
    
    if (result.syncedFiles.length === 0) {
      PromptService.log.info(result.message)
    } else {
      PromptService.log.success(result.message)
      PromptService.log.info(`Synced files: ${result.syncedFiles.join(', ')}`)
    }
  } catch (error) {
    PromptService.log.error(`Failed to sync config: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Create template function
 */
async function createTemplate(templateName: string, projectName: string): Promise<void> {
  const templateDir = templateName
  const sourcePath = pathUtils.resolveFromCwd('templates', templateDir)
  const targetPath = pathUtils.resolveFromCwd(projectName)

  // Check if source template exists
  if (!(await FileService.exists(sourcePath))) {
    throw new Error(`Template source directory not found: ${sourcePath}`)
  }

  // Check if target directory already exists
  if (await FileService.exists(targetPath)) {
    const shouldOverwrite = await PromptService.confirmAction(
      `Directory "${projectName}" already exists. Overwrite?`
    )
    
    if (!shouldOverwrite) {
      throw new Error('Project directory already exists')
    }
  }

  // Copy template files
  await copyDir(sourcePath, targetPath)
  
  // Update package.json if it exists
  await updateProjectPackageJson(targetPath, projectName)
}

/**
 * Handle the add command
 */
async function handleAddCommand(): Promise<void> {
  try {
    const url = await PromptService.getSubmoduleUrl(resolvedConfig)
    const path = await PromptService.getSubmodulePath(resolvedConfig)
    await SubmoduleService.add(url, path)
  } catch (error) {
    PromptService.log.error(`Failed to add submodule: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Handle the remove command
 */
async function handleRemoveCommand(): Promise<void> {
  try {
    const path = await PromptService.getSubmodulePath(resolvedConfig)
    await SubmoduleService.remove(path)
  } catch (error) {
    PromptService.log.error(`Failed to remove submodule: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function updateTemplate(templateName: string): Promise<void> {
  const templateDir = templateName
  const sourcePath = pathUtils.resolveFromRoot('templates', templateDir)
  const targetPath = pathUtils.resolveFromCwd(templateDir)

  // Check if source template exists
  if (!(await FileService.exists(sourcePath))) {
    throw new Error(`Template source directory not found: ${sourcePath}`)
  }

  // Copy template files (overwrite existing)
  await copyDir(sourcePath, targetPath)
  
  PromptService.log.info(`Updated files in ${targetPath}`)
}