<script setup lang="ts">
import { useTemplatePage } from "~/composables/facade/useTemplatePage";
import { useTemplatePageStore } from "~/stores/templatePage";
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";

useHead({
	title: "Template Selector",
});

const pageStore = useTemplatePageStore();
const { steps, currentConfig, tabs, handleGenerate, handleLoadConfig, handleAddToCompare, handleDownload } = useTemplatePage();
const { selectedLibraries } = useTemplateSelector();
</script>

<template>
	<div class="min-h-screen bg-white dark:bg-gray-950">
		<AppHeader />

		<main class="max-w-7xl mx-auto px-4 py-8">
			<div class="mb-8">
				<h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Build Your Template</h2>
				<p class="text-gray-500 dark:text-gray-400">
					Follow the steps below to create your perfect template
				</p>
			</div>

			<div class="flex gap-2 mb-6 overflow-x-auto pb-2">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					@click="pageStore.setActiveTab(tab.id)"
					class="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
					:class="pageStore.activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
				>
					<Icon :name="tab.icon" class="text-base" />
					{{ tab.label }}
				</button>
			</div>

			<div v-if="pageStore.activeTab === 'build'" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div class="lg:col-span-1 space-y-6">
					<StepIndicator :steps="steps" />
					<QuickActions @generate="handleGenerate" @clear="selectedLibraries.clear()" />
				</div>

				<div class="lg:col-span-3 space-y-6">
					<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
								<Icon name="mdi:code-tags" class="text-xl text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Step 1: Choose Framework</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">Select your preferred framework</p>
							</div>
						</div>
						<FrameworkSelector />
					</div>

					<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
								<Icon name="mdi:library" class="text-xl text-indigo-600 dark:text-indigo-400" />
							</div>
							<div>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Step 2: Select Libraries</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">Browse categories and add libraries</p>
							</div>
						</div>
						<div class="space-y-4">
							<CategoryTabs />
							<LibraryGrid />
						</div>
					</div>

					<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
								<Icon name="mdi:rocket-launch" class="text-xl text-green-600 dark:text-green-400" />
							</div>
							<div>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Step 3: Review & Generate</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">Review your selections and generate</p>
							</div>
						</div>
						<SelectedLibraries @generate="handleGenerate" @add-to-compare="handleAddToCompare" />
					</div>

					<div v-if="pageStore.showPreview && pageStore.generatedTemplate" class="space-y-6">
						<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
							<TemplatePreview :template="pageStore.generatedTemplate" @download="handleDownload" />
						</div>

						<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
							<RealTimeCodePreview />
						</div>

						<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
							<ConfigExportImport :config="currentConfig" :on-import="handleLoadConfig" />
						</div>

						<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
							<CopyCommands :config="currentConfig" />
						</div>

						<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
							<ShareUrl :config="currentConfig" />
						</div>

						<div class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
							<CompatibilityPanel :config="currentConfig" />
						</div>
					</div>
				</div>
			</div>

		<div v-if="pageStore.activeTab === 'presets'" class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
			<PresetSelector :on-select="handleLoadConfig" />
		</div>

		<div v-if="pageStore.activeTab === 'history'" class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
			<HistoryPanel :on-load="handleLoadConfig" />
		</div>

		<div v-if="pageStore.activeTab === 'saved'" class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
			<SavedConfigs :on-load="handleLoadConfig" />
		</div>

		<div v-if="pageStore.activeTab === 'comparison'" class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
			<TemplateComparison :configs="pageStore.comparisonConfigs" :on-select="handleLoadConfig" />
		</div>

		<div v-if="pageStore.activeTab === 'stats'" class="p-6 rounded-xl bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm">
			<StatsPanel />
		</div>
		</main>
	</div>
</template>
