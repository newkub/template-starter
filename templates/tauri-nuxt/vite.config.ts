import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import Unocss from '@unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Replace from 'unplugin-replace/vite'
import Unused from 'unplugin-unused/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import Terminal from 'vite-plugin-terminal'
import { analyzer } from 'vite-bundle-analyzer'
import Inspect from 'vite-plugin-inspect'
import AST from 'unplugin-ast/vite'
import Macros from 'unplugin-macros/vite'
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/vite'
import Icons from 'unplugin-icons/vite'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    Unocss(),
    AutoImport({
      imports: ['vue'],
      dts: true
    }),
    AST(),
    Icons({
      autoInstall: true,
    }),
    UnpluginIsolatedDecl(),
    Macros(),
    Replace(),
    TurboConsole({}),
    Terminal(),
    analyzer(),
    Inspect(),
    Unused({
      include: [/\.([cm]?[jt]sx?|vue)$/],
      exclude: [/node_modules/],
      level: 'warning',
      ignore: {
        peerDependencies: ['vue'],
      },
      depKinds: ['dependencies', 'peerDependencies'],
    }),
    vue(),
    tsconfigPaths(),
    checker({
      overlay: {
        initialIsOpen: false,
      },
      typescript: true,
      vueTsc: true,
    }),
  ],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
