<script setup lang="ts">
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";

const { selectedLibraries, toggleLibrary, generateTemplate: generateTemplateConfig } = useTemplateSelector();

const emit = defineEmits<{
  generate: [];
  addToCompare: [];
}>();

const handleGenerate = () => {
  emit("generate");
  generateTemplateConfig();
};

const handleAddToCompare = () => {
  emit("addToCompare");
};
</script>

<template>
  <div class="p-5 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Icon name="mdi:check-circle-outline" class="text-lg" />
        Selected Libraries
      </h3>
      <span
        v-if="selectedLibraries.size > 0"
        class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      >
        {{ selectedLibraries.size }} selected
      </span>
    </div>

		<div
			v-if="selectedLibraries.size === 0"
			class="flex flex-col items-center justify-center py-8 px-4 text-center"
		>
			<div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
				<Icon name="mdi:playlist-remove" class="text-3xl text-gray-400 dark:text-gray-500" />
			</div>
			<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				No libraries selected
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				Tap on libraries to add them to your template
			</p>
		</div>

		<div v-else class="space-y-2">
			<div
				v-for="libId in selectedLibraries"
				:key="libId"
				class="group flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
			>
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
						<Icon name="mdi:check" class="text-sm text-white" />
					</div>
					<span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ libId }}</span>
				</div>
				<button
					@click="toggleLibrary(libId)"
					class="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-gray-500 dark:hover:text-red-400 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
					:aria-label="`Remove ${libId}`"
					role="button"
				>
					<Icon name="mdi:close" class="text-base" />
				</button>
			</div>
		</div>

		<div class="flex gap-2 mt-5">
		<button
			@click="handleAddToCompare"
			class="flex-1 px-4 py-3 bg-white dark:bg-gray-950 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
			:disabled="selectedLibraries.size === 0"
			:aria-label="selectedLibraries.size === 0 ? 'Choose at least one library to compare' : 'Add current selection to comparison'"
			role="button"
		>
			<span class="flex items-center justify-center gap-2">
				<Icon name="mdi:compare" class="text-lg" />
				Add to Compare
			</span>
		</button>
		<button
			@click="handleGenerate"
			class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 shadow-sm hover:shadow-md"
			:disabled="selectedLibraries.size === 0"
			:aria-label="selectedLibraries.size === 0 ? 'Choose at least one library to continue' : 'Create your template with selected libraries'"
			role="button"
		>
			<span class="flex items-center justify-center gap-2">
				<Icon name="mdi:rocket-launch" class="text-lg" />
				Generate Template
			</span>
		</button>
	</div>
	</div>
</template>
