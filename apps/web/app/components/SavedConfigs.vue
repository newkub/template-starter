<script setup lang="ts">
import { ref } from "vue";
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";
import { useSavedConfigs } from "~/composables/core/useSavedConfigs";
import type { SavedConfig, TemplateConfig } from "~/shared/types/template";

interface Props {
	onLoad: (config: TemplateConfig) => void;
}

const props = defineProps<Props>();

const { selectedLibraries, generateTemplate: generateTemplateConfig } = useTemplateSelector();
const { savedConfigs, saveConfig, deleteConfig, loadConfig } = useSavedConfigs();

const showSaveDialog = ref(false);
const saveName = ref("");

const openSaveDialog = () => {
	showSaveDialog.value = true;
	saveName.value = "";
};

const closeSaveDialog = () => {
	showSaveDialog.value = false;
	saveName.value = "";
};

const handleSave = (config: TemplateConfig) => {
	if (!saveName.value.trim()) return;

	saveConfig(saveName.value.trim(), config);
	closeSaveDialog();
};

const handleLoad = (id: string) => {
	const config = loadConfig(id);
	if (config) {
		props.onLoad(config);
	}
};

const handleDelete = (id: string) => {
	if (confirm("Are you sure you want to delete this saved configuration?")) {
		deleteConfig(id);
	}
};
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Saved Configurations</h3>
			<button
				@click="openSaveDialog"
				class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
			>
				<Icon name="mdi:content-save" class="text-base" />
				Save Current
			</button>
		</div>

		<div v-if="savedConfigs.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
			<Icon name="mdi:content-save-outline" class="text-4xl mb-2" />
			<p class="text-sm">No saved configurations yet</p>
		</div>

		<div v-else class="space-y-2">
			<div
				v-for="config in savedConfigs"
				:key="config.id"
				class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
			>
				<div class="flex items-center justify-between">
					<div>
						<h4 class="font-medium text-gray-900 dark:text-gray-100">{{ config.name }}</h4>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{{ config.config.ecosystem }} • {{ config.config.libraries.length }} libraries
						</p>
					</div>
					<div class="flex gap-2">
						<button
							@click="handleLoad(config.id)"
							class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
							title="Load"
						>
							<Icon name="mdi:download" class="text-lg" />
						</button>
						<button
							@click="handleDelete(config.id)"
							class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
							title="Delete"
						>
							<Icon name="mdi:delete" class="text-lg" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div v-if="showSaveDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Save Configuration</h3>
			<input
				v-model="saveName"
				type="text"
				placeholder="Configuration name"
				class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
				@keyup.enter="() => handleSave(generateTemplateConfig()!)"
			/>
			<div class="flex gap-3 justify-end">
				<button
					@click="closeSaveDialog"
					class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				>
					Cancel
				</button>
				<button
					@click="() => handleSave(generateTemplateConfig()!)"
					class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Save
				</button>
			</div>
		</div>
	</div>
</template>
