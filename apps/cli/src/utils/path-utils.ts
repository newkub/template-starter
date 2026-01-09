import { join, resolve } from 'node:path'

/**
 * Join path segments
 */
export const joinPath = join

/**
 * Resolve path from current working directory
 */
export const resolveFromCwd = (...segments: string[]): string => {
  return join(process.cwd(), ...segments)
}

/**
 * Resolve path from root directory
 */
export const resolveFromRoot = (rootDir: string, ...segments: string[]): string => {
  return join(rootDir, ...segments)
}

/**
 * Resolve path from a base directory
 */
export const resolveFrom = (baseDir: string, ...segments: string[]): string => {
  return resolve(baseDir, ...segments)
}