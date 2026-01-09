import type { TemplateMap } from '../types/template'

// Template map constants using Bun APIs
export const TEMPLATE_MAP: TemplateMap = {
  'my-config': 'my-config',
  'monorepo': 'monorepo',
  'next': 'next',
  'nuxt': 'nuxt',
  'slidev': 'slidev',
  'tutorial': 'tutorial',
  'turborepo': 'turborepo',
  'vite-react': 'vite-react',
  'vitepress': 'vitepress',
  'vscode-vue': 'vscode-vue'
} as const

export const FROZEN_TEMPLATE_MAP = Object.freeze(TEMPLATE_MAP)