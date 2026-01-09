#!/usr/bin/env bun

import { runApp } from './app'

// Run the CLI application
if (import.meta.main) {
  const command = process.argv[2]
  const templateName = process.argv[3]
  runApp(command, templateName).catch(console.error)
}