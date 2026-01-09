import { FileService } from './file.service'
import { joinPath } from '../utils/path-utils'
import { getTemplatesRoot } from '../utils/config-utils'
import type { TemplateManifest } from '../types/version'
import { log } from '@clack/prompts'

export interface TemplatePreview {
  name: string
  version?: string | undefined
  description?: string | undefined
  structure: FileTreeNode[]
  dependencies?: DependencyInfo | undefined
  features?: string[] | undefined
  estimatedSize?: string | undefined
  category?: string | undefined
  tags?: string[] | undefined
}

export interface FileTreeNode {
  name: string
  type: 'file' | 'directory'
  path: string
  children?: FileTreeNode[] | undefined
  size?: string
}

export interface DependencyInfo {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  total: number
}

export class PreviewService {
  private static instance: PreviewService

  private constructor() {}

  static getInstance(): PreviewService {
    if (!PreviewService.instance) {
      PreviewService.instance = new PreviewService()
    }
    return PreviewService.instance
  }

  async previewTemplate(templateName: string, templatesRoot?: string): Promise<TemplatePreview> {
    const rootDir = getTemplatesRoot(templatesRoot)
    const templatePath = joinPath(rootDir, 'templates', templateName)

    if (!(await FileService.exists(templatePath))) {
      throw new Error(`Template "${templateName}" not found`)
    }

    const structure = await this.buildFileTree(templatePath, templateName)
    const dependencies = await this.extractDependencies(templatePath)
    const manifest = await this.getManifest(templatePath)

    return {
      name: templateName,
      version: manifest?.currentVersion ?? undefined,
      description: manifest?.description ?? undefined,
      structure,
      dependencies: dependencies ?? undefined,
      features: manifest?.versions[0]?.features,
      category: manifest?.category ?? undefined,
      tags: manifest?.tags
    }
  }

  async displayPreview(preview: TemplatePreview): Promise<void> {
    log.info(`\n📦 Template: ${preview.name}${preview.version ? ` (v${preview.version})` : ''}`)
    
    if (preview.description) {
      log.info(`\n📝 ${preview.description}`)
    }

    if (preview.category || preview.tags) {
      const meta = []
      if (preview.category) meta.push(`Category: ${preview.category}`)
      if (preview.tags?.length) meta.push(`Tags: ${preview.tags.join(', ')}`)
      log.info(`\n${meta.join(' | ')}`)
    }

    log.info('\n📁 Structure:')
    this.displayFileTree(preview.structure, '')

    if (preview.dependencies) {
      log.info('\n📦 Dependencies:')
      log.info(`   Total: ${preview.dependencies.total} packages`)
      
      if (preview.dependencies.dependencies && Object.keys(preview.dependencies.dependencies).length > 0) {
        log.info('   Production:')
        Object.entries(preview.dependencies.dependencies).slice(0, 10).forEach(([name, version]) => {
          log.info(`     - ${name}@${version}`)
        })
        if (Object.keys(preview.dependencies.dependencies).length > 10) {
          log.info(`     ... and ${Object.keys(preview.dependencies.dependencies).length - 10} more`)
        }
      }

      if (preview.dependencies.devDependencies && Object.keys(preview.dependencies.devDependencies).length > 0) {
        log.info('   Development:')
        Object.entries(preview.dependencies.devDependencies).slice(0, 5).forEach(([name, version]) => {
          log.info(`     - ${name}@${version}`)
        })
        if (Object.keys(preview.dependencies.devDependencies).length > 5) {
          log.info(`     ... and ${Object.keys(preview.dependencies.devDependencies).length - 5} more`)
        }
      }
    }

    if (preview.features && preview.features.length > 0) {
      log.info('\n✨ Features:')
      preview.features.forEach(feature => {
        log.info(`   - ${feature}`)
      })
    }
  }

  private async buildFileTree(path: string, basePath: string, maxDepth: number = 3, currentDepth: number = 0): Promise<FileTreeNode[]> {
    if (currentDepth >= maxDepth) {
      return []
    }

    const files = await FileService.readdir(path)
    const nodes: FileTreeNode[] = []

    for (const file of files) {
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
        continue
      }

      const filePath = joinPath(path, file)
      const relativePath = filePath.replace(basePath, '').replace(/^\//, '')
      const isFile = FileService.isFile(filePath)

      if (isFile) {
        nodes.push({
          name: file,
          type: 'file',
          path: relativePath
        })
      } else {
        const children = await this.buildFileTree(filePath, basePath, maxDepth, currentDepth + 1)
        nodes.push({
          name: file,
          type: 'directory',
          path: relativePath,
          children: children.length > 0 ? children : undefined
        })
      }
    }

    return nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === 'directory' ? -1 : 1
    })
  }

  private displayFileTree(nodes: FileTreeNode[], indent: string): void {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (!node) continue
      
      const isLast = i === nodes.length - 1
      const prefix = isLast ? '└── ' : '├── '
      const icon = node.type === 'directory' ? '📁' : '📄'

      log.info(`${indent}${prefix}${icon} ${node.name}`)

      if (node.children && node.children.length > 0) {
        const newIndent = indent + (isLast ? '    ' : '│   ')
        this.displayFileTree(node.children, newIndent)
      }
    }
  }

  private async extractDependencies(templatePath: string): Promise<DependencyInfo | undefined> {
    const packageJsonPath = joinPath(templatePath, 'package.json')

    if (!(await FileService.exists(packageJsonPath))) {
      return undefined
    }

    try {
      const content = await FileService.readFile(packageJsonPath)
      const packageJson = JSON.parse(content)

      const dependencies = packageJson.dependencies || {}
      const devDependencies = packageJson.devDependencies || {}
      const peerDependencies = packageJson.peerDependencies || {}

      return {
        dependencies,
        devDependencies,
        peerDependencies,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length + Object.keys(peerDependencies).length
      }
    } catch {
      return undefined
    }
  }

  private async getManifest(templatePath: string): Promise<TemplateManifest | null> {
    const manifestPath = joinPath(templatePath, '.template-manifest.json')

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
}
