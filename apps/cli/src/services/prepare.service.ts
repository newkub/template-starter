import { select, confirm, log, isCancel } from '@clack/prompts'
import { execSync } from 'child_process'
import { existsSync, writeFileSync, readFileSync } from 'fs'

interface ToolSelection {
  vitest: boolean
  oxlint: boolean
  dprint: boolean
  lefthook: boolean
}

export class PrepareService {
  static async handleCancel(value: unknown): Promise<void> {
    if (isCancel(value)) {
      process.exit(0)
    }
  }

  static async selectTools(): Promise<ToolSelection> {
    const tools = await select({
      message: 'Select tools to setup:',
      options: [
        { value: 'vitest', label: 'Vitest', hint: 'Testing framework with coverage' },
        { value: 'oxlint', label: 'Oxlint', hint: 'Fast JavaScript/TypeScript linter' },
        { value: 'dprint', label: 'Dprint', hint: 'Code formatter' },
        { value: 'lefthook', label: 'Lefthook', hint: 'Git hooks manager' },
        { value: 'all', label: 'All tools', hint: 'Setup all tools' }
      ]
    })

    await this.handleCancel(tools)

    if (tools === 'all') {
      return { vitest: true, oxlint: true, dprint: true, lefthook: true }
    }

    return {
      vitest: tools === 'vitest',
      oxlint: tools === 'oxlint',
      dprint: tools === 'dprint',
      lefthook: tools === 'lefthook'
    }
  }

  static async confirmSetup(selection: ToolSelection): Promise<boolean> {
    const selectedTools = Object.entries(selection)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name)
      .join(', ')

    const result = await confirm({
      message: `Setup ${selectedTools}?`
    })

    await this.handleCancel(result)
    return Boolean(result)
  }

  static async setupVitest(): Promise<void> {
    log.info('Setting up Vitest...')

    try {
      execSync('bun add -d vitest @vitest/coverage-v8 @vitest/ui', { stdio: 'inherit' })
    } catch (error) {
      log.warn('Failed to install vitest packages, skipping...')
      return
    }

    const vitestConfig = `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['verbose', 'html']
    },
    typecheck: {
      checker: 'tsc'
    },
  }
})
`

    writeFileSync('vitest.config.ts', vitestConfig)
    log.success('Vitest configured')
  }

  static async setupOxlint(): Promise<void> {
    log.info('Setting up Oxlint...')

    try {
      execSync('bun add -d oxlint oxlint-tsgolint', { stdio: 'inherit' })
    } catch (error) {
      log.warn('Failed to install oxlint packages, skipping...')
      return
    }

    const oxlintConfig = `{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "import",
    "oxc",
    "react",
    "unicorn",
    "react-perf",
    "vitest",
    "jsx-a11y",
    "nextjs",
    "promise",
    "typescript",
    "vue",
    "node"
  ],
  "env": {
    "browser": true,
    "node": true
  }
}
`

    writeFileSync('.oxlintrc.json', oxlintConfig)
    log.success('Oxlint configured')
  }

  static async setupDprint(): Promise<void> {
    log.info('Setting up Dprint...')

    try {
      execSync('bun add -d dprint', { stdio: 'inherit' })
    } catch (error) {
      log.warn('Failed to install dprint, skipping...')
      return
    }

    const dprintConfig = `{
  "includes": ["**/*.{ts,tsx,js,jsx,json,md}"],
  "excludes": ["node_modules", "dist", ".next", ".nuxt", "out"],
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.93.0.wasm",
    "https://plugins.dprint.dev/json-0.19.3.wasm",
    "https://plugins.dprint.dev/markdown-0.17.8.wasm"
  ],
  "typescript": {
    "quoteStyle": "alwaysDouble",
    "semiColons": "prefer",
    "trailingCommas": "onlyMultiLine"
  }
}
`

    writeFileSync('dprint.json', dprintConfig)
    log.success('Dprint configured')
  }

  static async setupLefthook(): Promise<void> {
    log.info('Setting up Lefthook...')

    try {
      execSync('bun add -d @commitlint/cli @commitlint/config-conventional', { stdio: 'inherit' })
    } catch (error) {
      log.warn('Failed to install lefthook packages, skipping...')
      return
    }

    const lefthookConfig = `pre-commit:
  jobs:
    - name: install
      run: bun install
    - name: git pull --rebase
      run: git pull --rebase
    - name: lint
      run: bun run lint {staged_files}
    - name: format
      run: bun run format {staged_files}

pre-push:
  jobs:
    - name: build
      run: bun run build

pre-rebase:
  jobs:
    - name: fetch-origin
      run: git fetch origin

post-receive:
  jobs:
    - name: open repo
      run: gh repo view --web

post-checkout:
  jobs:
    - name: install
      run: bun install
`

    writeFileSync('lefthook.yml', lefthookConfig)
    log.success('Lefthook configured')
  }

  static async updatePackageJson(selection: ToolSelection): Promise<void> {
    const packageJsonPath = 'package.json'

    if (!existsSync(packageJsonPath)) {
      log.warn('package.json not found, skipping update...')
      return
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    if (selection.vitest) {
      packageJson.scripts.test = 'vitest --run'
      packageJson.scripts['test:coverage'] = 'vitest run --coverage'
      packageJson.scripts['test:ui'] = 'vitest --ui'
    }

    if (selection.oxlint) {
      packageJson.scripts.lint = 'oxlint --fix --type-aware'
    }

    if (selection.dprint) {
      packageJson.scripts.format = 'dprint fmt'
    }

    if (selection.lefthook) {
      packageJson.scripts.prepare = 'lefthook install'
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    log.success('package.json updated')
  }

  static async run(): Promise<void> {
    log.info('🔧 Project Setup')

    const selection = await this.selectTools()
    const confirmed = await this.confirmSetup(selection)

    if (!confirmed) {
      log.info('Setup cancelled')
      return
    }

    if (selection.vitest) {
      await this.setupVitest()
    }

    if (selection.oxlint) {
      await this.setupOxlint()
    }

    if (selection.dprint) {
      await this.setupDprint()
    }

    if (selection.lefthook) {
      await this.setupLefthook()
    }

    await this.updatePackageJson(selection)

    log.success('✨ Setup complete!')
  }
}
