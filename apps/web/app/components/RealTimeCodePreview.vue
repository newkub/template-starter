<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";
import { useTemplateGenerator } from "~/composables/core/useTemplateGenerator";
import { useClipboard } from "~/composables/core/useClipboard";

const { selectedEcosystem, selectedLibraries, generateTemplate: generateTemplateConfig } = useTemplateSelector();
const { generateTemplate } = useTemplateGenerator();
const { copied, copyToClipboard } = useClipboard();

const activeTab = ref<"package" | "config" | "readme">("package");

const currentConfig = computed(() => {
	if (!selectedEcosystem.value) return null;
	return generateTemplateConfig();
});

const generatedTemplate = computed(() => {
	if (!currentConfig.value) return null;
	return generateTemplate(currentConfig.value);
});

const packageJson = computed(() => {
	if (!generatedTemplate.value) return "";
	const file = generatedTemplate.value.files.find((f) => f.path === "package.json");
	return file?.content || "";
});

const configFiles = computed(() => {
	if (!generatedTemplate.value) return [];
	return generatedTemplate.value.files.filter((f) => f.type === "config");
});

const readme = computed(() => {
	if (!generatedTemplate.value) return "";
	const file = generatedTemplate.value.files.find((f) => f.path === "README.md");
	return file?.content || "";
});

const selectedConfigFile = ref<string | null>(null);

const selectedConfigContent = computed(() => {
	if (!selectedConfigFile.value || !generatedTemplate.value) return "";
	const file = generatedTemplate.value.files.find((f) => f.path === selectedConfigFile.value);
	return file?.content || "";
});

const copyContent = async (content: string) => {
	await copyToClipboard(content);
};
</script>

<template>
	<div v-if="currentConfig" class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Real-time Code Preview</h3>
			<div class="flex gap-2">
				<button
					@click="activeTab = 'package'"
					class="px-3 py-1.5 text-sm rounded-lg transition-colors"
					:class="activeTab === 'package' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
				>
					package.json
				</button>
				<button
					@click="activeTab = 'config'"
					class="px-3 py-1.5 text-sm rounded-lg transition-colors"
					:class="activeTab === 'config' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
				>
					Config
				</button>
				<button
					@click="activeTab = 'readme'"
					class="px-3 py-1.5 text-sm rounded-lg transition-colors"
					:class="activeTab === 'readme' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
				>
					README
				</button>
			</div>
		</div>

		<div v-if="activeTab === 'package'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">package.json</span>
				<button
					@click="copyContent(packageJson)"
					class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
				>
					<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					{{ copied ? "Copied!" : "Copy" }}
				</button>
			</div>
			<pre class="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-3 rounded border border-gray-200 dark:border-gray-800 overflow-auto max-h-96 whitespace-pre-wrap">{{ packageJson }}</pre>
		</div>

		<div v-if="activeTab === 'config'" class="space-y-3">
			<div v-if="configFiles.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
				<Icon name="mdi:file-outline" class="text-4xl mb-2" />
				<p class="text-sm">No config files for this ecosystem</p>
			</div>

			<div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-3">
				<div class="lg:col-span-1 space-y-2">
					<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Config Files</h4>
					<button
						v-for="file in configFiles"
						:key="file.path"
						@click="selectedConfigFile = file.path"
						class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
						:class="selectedConfigFile === file.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
					>
						<Icon name="mdi:code-tags" class="text-base" />
						<span class="text-sm">{{ file.path }}</span>
					</button>
				</div>

				<div class="lg:col-span-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
							{{ selectedConfigFile || "Select a config file" }}
						</span>
						<button
							v-if="selectedConfigFile"
							@click="copyContent(selectedConfigContent)"
							class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
						>
							<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
							{{ copied ? "Copied!" : "Copy" }}
						</button>
					</div>
					<pre v-if="selectedConfigFile" class="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-3 rounded border border-gray-200 dark:border-gray-800 overflow-auto max-h-96 whitespace-pre-wrap">{{ selectedConfigContent }}</pre>
					<div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
						<Icon name="mdi:file-outline" class="text-4xl mb-2" />
						<p class="text-sm">Select a config file to preview</p>
					</div>
				</div>
			</div>
		</div>

		<div v-if="activeTab === 'readme'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">README.md</span>
				<button
					@click="copyContent(readme)"
					class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
				>
					<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					{{ copied ? "Copied!" : "Copy" }}
				</button>
			</div>
			<pre class="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-3 rounded border border-gray-200 dark:border-gray-800 overflow-auto max-h-96 whitespace-pre-wrap">{{ readme }}</pre>
		</div>
	</div>
</template>
