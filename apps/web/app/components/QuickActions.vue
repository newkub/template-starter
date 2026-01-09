<script setup lang="ts">
import { ref } from "vue";
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";
import { useHistory } from "~/composables/core/useHistory";
import { useToast } from "~/composables/core/useToast";
import { useKeyboardShortcuts } from "~/composables/core/useKeyboardShortcuts";

const { selectedEcosystem, selectedLibraries, generateTemplate: generateTemplateConfig } = useTemplateSelector();
const { addToHistory } = useHistory();
const { success, error } = useToast();
const { registerShortcut } = useKeyboardShortcuts();

const emit = defineEmits<{
	generate: [];
	clear: [];
}>();

const handleGenerate = () => {
	try {
		emit("generate");
		const config = generateTemplateConfig();
		if (config) {
			addToHistory(config);
			success("Template Generated", "Your template has been created successfully!");
		}
	} catch (err) {
		error("Generation Failed", "Failed to generate template. Please try again.");
	}
};

const handleClear = () => {
	selectedLibraries.value.clear();
	emit("clear");
	success("Selection Cleared", "All libraries have been deselected.");
};

const handleSavePreset = () => {
	const config = generateTemplateConfig();
	if (config) {
		success("Preset Saved", "Your configuration has been saved as a preset.");
	}
};

const actions = [
	{
		id: "generate",
		label: "Generate Template",
		icon: "mdi:rocket-launch",
		shortcut: "Ctrl+Enter",
		color: "from-blue-600 to-indigo-600",
		onClick: handleGenerate,
	},
	{
		id: "clear",
		label: "Clear Selection",
		icon: "mdi:delete-sweep",
		shortcut: "Ctrl+Shift+X",
		color: "from-red-600 to-rose-600",
		onClick: handleClear,
	},
	{
		id: "save",
		label: "Save as Preset",
		icon: "mdi:content-save",
		shortcut: "Ctrl+S",
		color: "from-green-600 to-emerald-600",
		onClick: handleSavePreset,
	},
];

registerShortcut({
	key: "Enter",
	ctrl: true,
	description: "Generate template",
	action: handleGenerate,
});

registerShortcut({
	key: "x",
	ctrl: true,
	shift: true,
	description: "Clear selection",
	action: handleClear,
});

registerShortcut({
	key: "s",
	ctrl: true,
	description: "Save as preset",
	action: handleSavePreset,
});
</script>

<template>
	<div class="space-y-3">
		<h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">Quick Actions</h3>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
			<button
				v-for="action in actions"
				:key="action.id"
				@click="action.onClick"
				:disabled="action.id === 'generate' && selectedLibraries.size === 0"
				class="relative group px-4 py-3 rounded-lg bg-gradient-to-r text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
				:class="[
					action.color,
					action.id === 'generate' ? 'focus:ring-blue-500' : action.id === 'clear' ? 'focus:ring-red-500' : 'focus:ring-green-500',
				]"
				:aria-label="`${action.label} (${action.shortcut})`"
			>
				<div class="flex items-center justify-center gap-2">
					<Icon :name="action.icon" class="text-lg" />
					<span class="text-sm">{{ action.label }}</span>
				</div>
				<div
					class="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
				>
					<kbd
						class="px-2 py-1 text-xs font-mono bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded shadow-lg"
					>
						{{ action.shortcut }}
					</kbd>
				</div>
			</button>
		</div>
	</div>
</template>
