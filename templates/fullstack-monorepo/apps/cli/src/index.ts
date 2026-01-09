#!/usr/bin/env bun
import { intro, outro, select, text, confirm } from '@clack/prompts'
import { Command } from 'commander'

const program = new Command()

program
  .name('@fullstack-monorepo/cli')
  .description('CLI tool for fullstack-monorepo')
  .version('0.0.0')

program.action(async () => {
  intro('@fullstack-monorepo/cli')

  const name = await text({
    message: 'What is your name?',
    placeholder: 'John Doe',
  })

  if (typeof name !== 'string') {
    outro('Operation cancelled')
    process.exit(0)
  }

  const action = await select({
    message: `Hello ${name}! What would you like to do?`,
    options: [
      { value: 'build', label: 'Build the project' },
      { value: 'dev', label: 'Start development' },
      { value: 'lint', label: 'Run linter' },
      { value: 'test', label: 'Run tests' },
    ],
  })

  if (typeof action !== 'string') {
    outro('Operation cancelled')
    process.exit(0)
  }

  const shouldContinue = await confirm({
    message: `Do you want to ${action}?`,
  })

  if (typeof shouldContinue !== 'boolean') {
    outro('Operation cancelled')
    process.exit(0)
  }

  if (shouldContinue) {
    outro(`Running ${action}...`)
  } else {
    outro('Operation cancelled')
  }
})

program.parse()
