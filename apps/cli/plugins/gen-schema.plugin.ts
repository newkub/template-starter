import type { Plugin } from 'tsdown'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { UserConfigSchema } from '../src/types/config.schema.ts'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export function genSchemaPlugin(): Plugin {
  return {
    name: 'gen-schema',
    buildStart() {
      const jsonSchema = zodToJsonSchema(UserConfigSchema, {
        name: 'Templates CLI Configuration',
        description: 'Configuration file for @newkub/templates-cli',
        $schemaStrategy: 'default'
      })

      // Write schema to dist directory
      const distPath = join(process.cwd(), 'dist')
      const schemaPath = join(distPath, '.templates-cli.schema.json')
      
      // Ensure dist directory exists
      mkdirSync(distPath, { recursive: true })
      
      writeFileSync(schemaPath, JSON.stringify(jsonSchema, null, 2))

      console.log('✅ Generated .templates-cli.schema.json to dist/')
    }
  }
}
