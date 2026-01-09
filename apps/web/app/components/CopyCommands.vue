<script setup lang="ts">
import { ref, computed } from "vue";
import type { TemplateConfig } from "~/shared/types/template";
import { useClipboard } from "~/composables/core/useClipboard";
import { useCliCommands } from "~/composables/core/useCliCommands";

interface Props {
	config: TemplateConfig | null;
}

const props = defineProps<Props>();

const { copied, copyToClipboard } = useClipboard();
const { generateCommands, generateFullScript } = useCliCommands();

const activeTab = ref<"commands" | "script">("commands");

const commands = computed(() => {
	if (!props.config) return null;
	return generateCommands(props.config);
});

const fullScript = computed(() => {
	if (!props.config) return "";
	return generateFullScript(props.config);
});

const copyCommand = async (command: string, label: string) => {
	await copyToClipboard(command);
	console.log(`${label} copied`);
};

const copyFullScript = async () => {
	if (fullScript.value) {
		await copyToClipboard(fullScript.value);
	}
};
</script>

<template>
	<div v-if="config" class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Commands</h3>
			<div class="flex gap-2">
				<button
					@click="activeTab = 'commands'"
					class="px-3 py-1.5 text-sm rounded-lg transition-colors"
					:class="activeTab === 'commands' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
				>
					Commands
				</button>
				<button
					@click="activeTab = 'script'"
					class="px-3 py-1.5 text-sm rounded-lg transition-colors"
					:class="activeTab === 'script' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
				>
					Full Script
				</button>
			</div>
		</div>

		<div v-if="activeTab === 'commands' && commands" class="space-y-3">
			<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Create Project</span>
					<button
						@click="copyCommand(commands.create, 'Create command')"
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
					>
						<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					</button>
				</div>
				<code class="block text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800">{{ commands.create }}</code>
			</div>

			<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Install Dependencies</span>
					<button
						@click="copyCommand(commands.install, 'Install command')"
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
					>
						<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					</button>
				</div>
				<code class="block text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800">{{ commands.install }}</code>
			</div>

			<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Start Dev Server</span>
					<button
						@click="copyCommand(commands.dev, 'Dev command')"
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
					>
						<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					</button>
				</div>
				<code class="block text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800">{{ commands.dev }}</code>
			</div>

			<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Build for Production</span>
					<button
						@click="copyCommand(commands.build, 'Build command')"
						class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
					>
						<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					</button>
				</div>
				<code class="block text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800">{{ commands.build }}</code>
			</div>
		</div>

		<div v-if="activeTab === 'script'" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Full Setup Script</span>
				<button
					@click="copyFullScript"
					class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
				>
					<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
					{{ copied ? "Copied!" : "Copy" }}
				</button>
			</div>
			<pre class="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-3 rounded border border-gray-200 dark:border-gray-800 overflow-auto max-h-96 whitespace-pre-wrap">{{ fullScript }}</pre>
		</div>
	</div>
</template>
