export interface TemplateVersion {
  version: string
  releaseDate: string
  changelog: string[]
  breakingChanges?: string[]
  features?: string[]
  bugfixes?: string[]
}

export interface TemplateManifest {
  name: string
  currentVersion: string
  versions: TemplateVersion[]
  description?: string
  category?: string
  tags?: string[]
  framework?: string
  language?: string
}

export interface VersionSelection {
  templateName: string
  version: string
}

export type VersionSortOrder = 'latest' | 'oldest' | 'semver'
