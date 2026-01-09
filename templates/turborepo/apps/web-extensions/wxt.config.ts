import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Web Extension',
    description: 'My awesome web extension',
    version: '0.0.0',
    permissions: ['storage'],
    host_permissions: ['<all_urls>'],
  },
});
