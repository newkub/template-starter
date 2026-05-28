import { defineConfig } from 'wxt';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'webextension-polyfill'],
        dts: true,
      }),
      Components({
        dts: true,
      }),
    ],
  }),
});
