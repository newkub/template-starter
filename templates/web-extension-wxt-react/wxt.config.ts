import { defineConfig } from 'wxt';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [
      UnoCSS(),
      AutoImport({
        imports: ['react', 'react-dom', 'webextension-polyfill'],
        dts: true,
      }),
    ],
  }),
});
