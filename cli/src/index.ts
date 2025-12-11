#!/usr/bin/env bun

import { runApp } from './app'

// Run the CLI application
if (import.meta.main) {
  runApp().catch(console.error)
}