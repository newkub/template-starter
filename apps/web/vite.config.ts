import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import solidPlugin from 'vite-plugin-solid';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [tanstackStart(), solidPlugin({ ssr: true }), UnoCSS()],
	server: {
		port: 3000,
	},
	resolve: {
		tsconfigPaths: true,
	},
});
