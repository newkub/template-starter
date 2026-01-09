<script setup lang="ts">
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";
import type { LibraryCategoryConfig } from "~/shared/types/template";

useHead({
	title: "Template Selector",
});

const colorMode = useColorMode();
const {
	selectedEcosystem,
	selectedLibraries,
	activeCategory,
	ecosystems,
	libraryCategories,
	currentEcosystem,
	currentLibraries,
	toggleLibrary,
	isSelected,
	generateTemplate,
} = useTemplateSelector();

const getCategoryName = () => {
	const category = libraryCategories.find((c: LibraryCategoryConfig) => c.id === activeCategory.value);
	return category?.name || "";
};

const toggleTheme = () => {
	colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
	<div class="min-h-screen bg-background text-text">
		<header class="border-b border-border bg-card">
			<div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Icon name="mdi:application" class="text-3xl text-primary" />
					<h1 class="text-xl font-bold">Template Generator</h1>
				</div>
				<button
					@click="toggleTheme"
					class="p-2 rounded-lg hover:bg-muted transition-colors"
					:aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`"
				>
					<Icon 
						:name="colorMode.value === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'" 
						class="text-xl"
					/>
				</button>
			</div>
		</header>

		<main class="max-w-7xl mx-auto px-4 py-8">
			<div class="mb-8">
				<h2 class="text-3xl font-bold mb-2">Build Your Template</h2>
				<p class="text-muted-foreground">
					Choose your framework and select the libraries you need to get started
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div class="md:col-span-1 lg:col-span-1 order-2 lg:order-1">
					<div class="space-y-2">
						<label class="text-sm font-medium">Framework</label>
						<div class="space-y-2" role="radiogroup" aria-label="Select framework">
							<button
								v-for="eco in ecosystems"
								:key="eco.id"
								@click="selectedEcosystem = eco.id"
								role="radio"
								:aria-checked="selectedEcosystem === eco.id"
								:aria-label="`Select ${eco.name} framework`"
								class="w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
								:class="selectedEcosystem === eco.id ? 'border-primary bg-primary/5' : 'border-border'"
							>
								<div class="flex items-center gap-2 sm:gap-3">
									<Icon :name="eco.icon" class="text-xl sm:text-2xl" />
									<div>
										<div class="font-semibold text-sm sm:text-base">{{ eco.name }}</div>
										<div class="text-xs sm:text-sm text-muted-foreground">{{ eco.description }}</div>
									</div>
								</div>
							</button>
						</div>
					</div>

					<div class="mt-8 space-y-2">
						<label class="text-sm font-medium">Library Categories</label>
						<div class="flex flex-wrap gap-2" role="tablist" aria-label="Library categories">
							<button
								v-for="cat in libraryCategories"
								:key="cat.id"
								@click="activeCategory = cat.id"
								role="tab"
								:aria-selected="activeCategory === cat.id"
								:aria-label="`Show ${cat.name} libraries`"
								class="px-3 py-2 sm:px-4 rounded-lg border transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background text-xs sm:text-sm"
								:class="activeCategory === cat.id ? 'border-primary bg-primary/5' : 'border-border'"
							>
								<div class="flex items-center gap-2">
									<Icon :name="cat.icon" class="text-xs sm:text-sm" />
									<span class="text-xs sm:text-sm font-medium">{{ cat.name }}</span>
								</div>
							</button>
						</div>
					</div>

					<div class="mt-8 p-4 rounded-lg bg-card border border-border">
						<h3 class="font-semibold mb-2">Selected Libraries</h3>
						<div v-if="selectedLibraries.size === 0" class="text-sm text-muted-foreground">
							No libraries selected
						</div>
						<div v-else class="space-y-2">
							<div
								v-for="libId in selectedLibraries"
								:key="libId"
								class="flex items-center justify-between p-2 rounded bg-muted"
							>
								<span class="text-sm">{{ libId }}</span>
								<button
									@click="toggleLibrary(libId)"
									class="text-muted-foreground hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
									:aria-label="`Remove ${libId}`"
									role="button"
								>
									<Icon name="mdi:close" class="text-sm" />
								</button>
							</div>
						</div>
						<button
							@click="generateTemplate"
							class="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
							:disabled="selectedLibraries.size === 0"
							:aria-label="selectedLibraries.size === 0 ? 'Choose at least one library to continue' : 'Create your template with selected libraries'"
							role="button"
						>
							Generate Template
						</button>
					</div>
				</div>

				<div class="lg:col-span-3 order-1 lg:order-2">
					<div class="mb-4">
						<h3 class="text-xl font-semibold">
							{{ getCategoryName() }} Libraries
						</h3>
						<p class="text-sm text-muted-foreground">
							Tap to add or remove libraries from your template
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Available libraries">
						<button
							v-for="lib in currentLibraries"
							:key="lib.id"
							@click="toggleLibrary(lib.id)"
							role="checkbox"
							:aria-checked="isSelected(lib.id)"
							:aria-label="`${isSelected(lib.id) ? 'Remove' : 'Add'} ${lib.name} to your template`"
							class="p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
							:class="isSelected(lib.id) ? 'border-primary bg-primary/5' : 'border-border'"
						>
							<div class="flex items-start gap-3">
								<Icon :name="lib.icon" class="text-2xl mt-1" />
								<div class="flex-1">
									<div class="flex items-center justify-between">
										<div class="font-semibold">{{ lib.name }}</div>
										<Icon
											:name="isSelected(lib.id) ? 'mdi:check-circle' : 'mdi:checkbox-blank-circle-outline'"
											:class="isSelected(lib.id) ? 'text-primary' : 'text-muted-foreground'"
										/>
									</div>
									<div class="text-sm text-muted-foreground mt-1">{{ lib.description }}</div>
								</div>
							</div>
						</button>
					</div>

					<div v-if="currentLibraries.length === 0" class="text-center py-12 text-muted-foreground">
						<Icon name="mdi:information" class="text-4xl mb-2" />
						<p>No libraries available for this category</p>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>
