/**
 * Get the root directory of the project
 */
export function getRootDir(): string {
  // In Bun, we can use import.meta.dir to get the directory of the current module
  // and then navigate up the directory tree
  const currentDir = import.meta.dir
  // Navigate up 4 levels to get to the root (src/utils/path-utils.ts -> root)
  return `${currentDir}/../../..`
}

/**
 * Check if a value is a cancel signal from clack prompts
 */
export function isCancel(value: unknown): boolean {
  return value === undefined || value === null
}