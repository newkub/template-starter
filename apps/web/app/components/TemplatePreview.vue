<script setup lang="ts">
import { ref, computed } from "vue";
import type { GeneratedTemplate, TemplateFile } from "~/shared/types/template";
import { useClipboard } from "~/composables/core/useClipboard";

interface Props {
	template: GeneratedTemplate | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	download: [];
}>();

const { copyToClipboard, copied } = useClipboard();
const selectedFile = ref<TemplateFile | null>(null);

const fileTree = computed(() => {
	if (!props.template) return [];
	return props.template.files;
});

const selectFile = (file: TemplateFile) => {
	selectedFile.value = file;
};

const copyFileContent = async (content: string) => {
	await copyToClipboard(content);
};

const getFileIcon = (type: string) => {
	switch (type) {
		case "json":
			return "mdi:code-json";
		case "markdown":
			return "mdi:markdown";
		case "code":
			return "mdi:code-tags";
		default:
			return "mdi:file";
	}
};
</script>

<template>
	<div v-if="template" class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Template Preview</h3>
			<button
				@click="emit('download')"
				class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
			>
				<Icon name="mdi:download" class="text-base" />
				Download ZIP
			</button>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Files</h4>
				<div class="space-y-1">
					<button
						v-for="file in fileTree"
						:key="file.path"
						@click="selectFile(file)"
						class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
						:class="selectedFile?.path === file.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
					>
						<Icon :name="getFileIcon(file.type)" class="text-base" />
						<span class="text-sm">{{ file.path }}</span>
					</button>
				</div>
			</div>

			<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<div class="flex items-center justify-between mb-3">
					<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
						{{ selectedFile ? selectedFile.path : "Select a file" }}
					</h4>
					<button
						v-if="selectedFile"
						@click="copyFileContent(selectedFile.content)"
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
					>
						<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
						{{ copied ? "Copied!" : "Copy" }}
					</button>
				</div>
				<div v-if="selectedFile" class="p-3 rounded-md bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-auto max-h-96">
					<pre class="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ selectedFile.content }}</pre>
				</div>
				<div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
					<Icon name="mdi:file-outline" class="text-4xl mb-2" />
					<p class="text-sm">Select a file to preview</p>
				</div>
			</div>
		</div>
	</div>
</template>
