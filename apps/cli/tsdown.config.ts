import { defineConfig } from 'tsdown'
import { genSchemaPlugin } from './plugins/gen-schema.plugin.ts'

export default defineConfig({
  dts: {
    sourcemap: true
  },
  exports: true,
  entry: './src/index.ts',
  format: 'esm',
  clean: true,
  minify: true,
  plugins: [genSchemaPlugin()],
  hooks: {}
})
