<script setup lang="ts">
import { ref } from "vue";
import type { TemplateConfig } from "~/shared/types/template";
import { useConfigExportImport } from "~/composables/core/useConfigExportImport";
import { useToast } from "~/composables/core/useToast";

interface Props {
	config: TemplateConfig | null;
	onImport: (config: TemplateConfig) => void;
}

const props = defineProps<Props>();

const { exportConfig, importConfig, validateConfig } = useConfigExportImport();
const { success, error } = useToast();

const fileInput = ref<HTMLInputElement | null>(null);

const handleExport = () => {
	if (!props.config) return;
	try {
		exportConfig(props.config);
		success("Config Exported", "Configuration has been exported successfully.");
	} catch (err) {
		error("Export Failed", "Failed to export configuration.");
	}
};

const handleImportClick = () => {
	fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;

	try {
		const config = await importConfig(file);
		if (!config) {
			error("Import Failed", "Failed to parse the configuration file.");
			return;
		}

		if (!validateConfig(config)) {
			error("Invalid Config", "The configuration file is not valid.");
			return;
		}

		props.onImport(config);
		success("Config Imported", "Configuration has been imported successfully.");
	} catch (err) {
		error("Import Failed", "Failed to import configuration.");
	}

	target.value = "";
};
</script>

<template>
	<div class="space-y-4">
		<h3 class="font-semibold text-gray-900 dark:text-gray-100">Export/Import Configuration</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<button
				@click="handleExport"
				:disabled="!config"
				class="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
				:aria-label="!config ? 'No configuration to export' : 'Export current configuration as JSON file'"
			>
				<Icon name="mdi:export" class="text-lg" />
				Export Config
			</button>

			<button
				@click="handleImportClick"
				class="px-4 py-3 bg-white dark:bg-gray-950 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 flex items-center justify-center gap-2"
				aria-label="Import configuration from JSON file"
			>
				<Icon name="mdi:import" class="text-lg" />
				Import Config
			</button>
		</div>

		<input
			ref="fileInput"
			type="file"
			accept=".json"
			class="hidden"
			@change="handleFileChange"
		/>

		<div class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
			<Icon name="mdi:information" class="text-base mt-0.5" />
			<p>Export your configuration to share with your team or import a saved configuration to continue working.</p>
		</div>
	</div>
</template>
