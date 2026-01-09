<script setup lang="ts">
import { ref } from "vue";
import type { Preset, TemplateConfig } from "~/shared/types/template";
import { presets } from "~/shared/data/presets";

interface Props {
	onSelect: (config: TemplateConfig) => void;
}

const props = defineProps<Props>();

const selectedPreset = ref<string | null>(null);

const handleSelect = (preset: Preset) => {
	selectedPreset.value = preset.id;
	props.onSelect(preset.config);
};

const getPresetColor = (id: string) => {
	switch (id) {
		case "fullstack-next":
		case "nuxt-fullstack":
		case "bun-ssr":
			return "from-blue-500 to-indigo-500";
		case "minimal-nuxt":
		case "next-ui-only":
			return "from-green-500 to-emerald-500";
		case "bun-api":
			return "from-orange-500 to-red-500";
		case "flutter-mobile":
			return "from-purple-500 to-pink-500";
		case "kotlin-desktop":
			return "from-cyan-500 to-blue-500";
		default:
			return "from-gray-500 to-gray-600";
	}
};
</script>

<template>
	<div class="space-y-4">
		<h3 class="font-semibold text-gray-900 dark:text-gray-100">Quick Presets</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
			<button
				v-for="preset in presets"
				:key="preset.id"
				@click="handleSelect(preset)"
				class="p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
				:class="selectedPreset === preset.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'"
			>
				<div class="flex items-center gap-3 mb-2">
					<div :class="`w-10 h-10 rounded-lg bg-gradient-to-br ${getPresetColor(preset.id)} flex items-center justify-center`">
						<Icon :name="preset.icon" class="text-xl text-white" />
					</div>
					<div>
						<h4 class="font-semibold text-sm text-gray-900 dark:text-gray-100">{{ preset.name }}</h4>
						<p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ preset.config.ecosystem }}</p>
					</div>
				</div>
				<p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ preset.description }}</p>
				<div class="flex flex-wrap gap-1">
					<span
						v-for="tag in preset.tags"
						:key="tag"
						class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
					>
						{{ tag }}
					</span>
				</div>
			</button>
		</div>
	</div>
</template>
