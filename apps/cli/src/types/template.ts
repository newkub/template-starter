export type TemplateName = 
  | 'my-config'
  | 'monorepo'
  | 'next'
  | 'nuxt'
  | 'slidev'
  | 'tutorial'
  | 'turborepo'
  | 'vite-react'
  | 'vitepress'
  | 'vscode-vue'

export type TemplateMap = Record<TemplateName, string>