import { join } from 'node:path'

/**
 * Get the root directory of the project
 */
export function getRootDir(): string {
  const currentDir = import.meta.dir
  return `${currentDir}/../../..`
}

/**
 * Path utility functions
 */
export const pathUtils = {
  join: join as typeof join,

  resolveFromCwd(...segments: string[]): string {
    return join(process.cwd(), ...segments)
  },

  resolveFromRoot(...segments: string[]): string {
    return join(getRootDir(), ...segments)
  }
} as const