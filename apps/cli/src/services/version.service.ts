import { FileService } from './file.service'
import { joinPath } from '../utils/path-utils'
import { getTemplatesRoot } from '../utils/config-utils'
import type { TemplateVersion, TemplateManifest, VersionSelection, VersionSortOrder } from '../types/version'
import { select } from '@clack/prompts'

export class VersionService {
  private static instance: VersionService

  private constructor() {}

  static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService()
    }
    return VersionService.instance
  }

  async getTemplateManifest(templateName: string, templatesRoot?: string): Promise<TemplateManifest | null> {
    const rootDir = getTemplatesRoot(templatesRoot)
    const manifestPath = joinPath(rootDir, 'templates', templateName, '.template-manifest.json')

    if (!(await FileService.exists(manifestPath))) {
      return null
    }

    try {
      const content = await FileService.readFile(manifestPath)
      return JSON.parse(content) as TemplateManifest
    } catch {
      return null
    }
  }

  async getAvailableVersions(templateName: string, templatesRoot?: string): Promise<TemplateVersion[]> {
    const manifest = await this.getTemplateManifest(templateName, templatesRoot)
    return manifest?.versions || []
  }

  async getLatestVersion(templateName: string, templatesRoot?: string): Promise<string | null> {
    const versions = await this.getAvailableVersions(templateName, templatesRoot)
    if (versions.length === 0) return null

    return versions[0]?.version ?? null
  }

  async selectVersion(templateName: string, sortOrder: VersionSortOrder = 'latest', templatesRoot?: string): Promise<VersionSelection> {
    const versions = await this.getAvailableVersions(templateName, templatesRoot)

    if (versions.length === 0) {
      return { templateName, version: 'latest' }
    }

    const sortedVersions = this.sortVersions(versions, sortOrder)

    const choices = sortedVersions.map(v => ({
      value: v.version,
      label: `${v.version} ${v.releaseDate ? `(${v.releaseDate})` : ''}`,
      hint: v.changelog.slice(0, 2).join(', ') + (v.changelog.length > 2 ? '...' : '')
    }))

    const selectedVersion = await select({
      message: `Select version for "${templateName}":`,
      options: choices
    })

    if (typeof selectedVersion !== 'string') {
      return { templateName, version: sortedVersions[0]?.version ?? 'latest' }
    }

    return { templateName, version: selectedVersion }
  }

  async getChangelog(templateName: string, version?: string, templatesRoot?: string): Promise<string> {
    const manifest = await this.getTemplateManifest(templateName, templatesRoot)
    if (!manifest) return 'No changelog available'

    const targetVersion = version || manifest.currentVersion
    const versionData = manifest.versions.find(v => v.version === targetVersion)

    if (!versionData) return `Version ${targetVersion} not found`

    let changelog = `## ${versionData.version} - ${versionData.releaseDate}\n\n`

    if (versionData.breakingChanges && versionData.breakingChanges.length > 0) {
      changelog += '### Breaking Changes\n'
      versionData.breakingChanges.forEach(change => {
        changelog += `- ${change}\n`
      })
      changelog += '\n'
    }

    if (versionData.features && versionData.features.length > 0) {
      changelog += '### Features\n'
      versionData.features.forEach(feature => {
        changelog += `- ${feature}\n`
      })
      changelog += '\n'
    }

    if (versionData.bugfixes && versionData.bugfixes.length > 0) {
      changelog += '### Bug Fixes\n'
      versionData.bugfixes.forEach(fix => {
        changelog += `- ${fix}\n`
      })
      changelog += '\n'
    }

    changelog += '### Changes\n'
    versionData.changelog.forEach(change => {
      changelog += `- ${change}\n`
    })

    return changelog
  }

  async createManifest(templateName: string, initialVersion: string = '1.0.0', templatesRoot?: string): Promise<void> {
    const rootDir = getTemplatesRoot(templatesRoot)
    const manifestPath = joinPath(rootDir, 'templates', templateName, '.template-manifest.json')

    const manifest: TemplateManifest = {
      name: templateName,
      currentVersion: initialVersion,
      versions: [
        {
          version: initialVersion,
          releaseDate: new Date().toISOString().split('T')[0] ?? '',
          changelog: ['Initial release']
        }
      ]
    }

    await FileService.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  }

  private sortVersions(versions: TemplateVersion[], order: VersionSortOrder): TemplateVersion[] {
    const sorted = [...versions]

    if (order === 'latest') {
      sorted.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
    } else if (order === 'oldest') {
      sorted.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }))
    } else if (order === 'semver') {
      sorted.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
    }

    return sorted
  }
}
