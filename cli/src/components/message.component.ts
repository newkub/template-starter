import type { TemplateName } from '../types/template'

/**
 * Format a success message for template creation
 */
export function formatUseSuccessMessage(templateName: TemplateName, projectName: string): string {
  return `Successfully created project "${projectName}" from template "${templateName}"`
}

/**
 * Format a success message for template update
 */
export function formatUpdateSuccessMessage(templateName: TemplateName): string {
  return `Successfully updated template "${templateName}"`
}

/**
 * Format navigation instructions
 */
export function formatNavigationInstructions(projectName: string): string {
  return `Navigate to ./${projectName} to get started`
}

/**
 * Format sync success message
 */
export function formatSyncSuccessMessage(templateName: TemplateName, syncedFiles: string[]): string {
  return `Successfully synced ${syncedFiles.length} files from template "${templateName}"`
}