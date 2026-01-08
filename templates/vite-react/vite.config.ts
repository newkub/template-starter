import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nitro } from "nitro/vite";
import UnoCSS from 'unocss/vite'
import MillionLint from "@million/lint";
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import Pages from 'vite-plugin-pages'
import oxlintPlugin from 'vite-plugin-oxlint'
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



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nitro(),
    UnoCSS(),
    AutoImport({
      imports: ['react', 'react-dom'],
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
        peerDependencies: ['react', 'react-dom'],
      },
      depKinds: ['dependencies', 'peerDependencies'],
    }),
    Pages({
       dirs: [
        { dir: 'src/pages', baseRoute: '' },
      ],
    }),
    react(),
    tsconfigPaths(),
    checker({
      overlay: {
        initialIsOpen: false,
      },
      typescript: true,
      biome: {
        command: 'check',
      },
    }),
  ],
});
