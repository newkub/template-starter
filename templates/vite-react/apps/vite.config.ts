import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nitro from '@analogjs/vite-plugin-nitro';
import UnoCSS from 'unocss/vite'
import MillionLint from "@million/lint";
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import Pages from 'vite-plugin-pages'
import oxlintPlugin from 'vite-plugin-oxlint'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    /*
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),*/
    /*
    oxlintPlugin({
      path: 'src',
      configFile: '.oxlintrc.json'
    }),*/
    Pages({
       dirs: [
        { dir: 'src/pages', baseRoute: '' },
      ],
    }),
    react(),
    //MillionLint.vite(),
    UnoCSS(),
    tsconfigPaths(),
    nitro({
      ssr: true,
      entryServer: 'src/main.server.tsx',
      prerender: {
        routes: ['/'],
      },
    }),
    
    checker({
      typescript: true,
      biome: {
        command: '',
      },
    }),
  ],
});
