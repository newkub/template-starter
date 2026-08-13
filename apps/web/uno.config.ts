import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';

export default defineConfig({
	presets: [presetUno(), presetIcons()],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	content: {
		filesystem: ['./src/**/*.{html,js,ts,jsx,tsx}'],
	},
});
