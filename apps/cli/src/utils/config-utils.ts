import { joinPath } from './path-utils'

export function getTemplatesRoot(templatesRoot?: string): string {
  if (templatesRoot) {
    return templatesRoot
  }

  if (process.env.TEMPLATES_ROOT) {
    return joinPath(process.cwd(), process.env.TEMPLATES_ROOT)
  }

  return joinPath(process.cwd(), '../..')
}

export function getHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || ''
}
