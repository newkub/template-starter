<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";

const { currentLibraries, getCategoryName, toggleLibrary, isSelected } = useTemplateSelector();

const searchQuery = ref("");
const sortBy = ref<"name" | "popularity">("name");

const filteredLibraries = computed(() => {
	let libs = [...currentLibraries.value];

	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		libs = libs.filter((lib) => lib.name.toLowerCase().includes(query) || lib.description.toLowerCase().includes(query));
	}

	libs.sort((a, b) => {
		if (sortBy.value === "name") {
			return a.name.localeCompare(b.name);
		} else {
			return (b.popularity || 0) - (a.popularity || 0);
		}
	});

	return libs;
});

const clearSearch = () => {
	searchQuery.value = "";
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{{ getCategoryName }} Libraries
				</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Tap to add or remove libraries from your template
				</p>
			</div>
			<div class="flex items-center gap-2">
				<select
					v-model="sortBy"
					class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="name">Sort by Name</option>
					<option value="popularity">Sort by Popularity</option>
				</select>
			</div>
		</div>

		<div class="relative">
			<Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search libraries..."
				class="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				v-if="searchQuery"
				@click="clearSearch"
				class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
			>
				<Icon name="mdi:close" class="text-lg" />
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Available libraries">
		<button
			v-for="lib in filteredLibraries"
			:key="lib.id"
			@click="toggleLibrary(lib.id)"
			role="checkbox"
			:aria-checked="isSelected(lib.id)"
			:aria-label="`${isSelected(lib.id) ? 'Remove' : 'Add'} ${lib.name} to your template`"
			class="p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
			:class="isSelected(lib.id) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
		>
			<div class="flex items-start gap-3">
				<Icon :name="lib.icon" class="text-2xl mt-1" />
				<div class="flex-1">
					<div class="flex items-center justify-between">
						<div class="font-semibold text-gray-900 dark:text-gray-100">{{ lib.name }}</div>
						<Icon
							:name="isSelected(lib.id) ? 'mdi:check-circle' : 'mdi:checkbox-blank-circle-outline'"
							:class="isSelected(lib.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
					/>
					</div>
					<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ lib.description }}</div>
				</div>
			</div>
		</button>
	</div>

	<div v-if="filteredLibraries.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
		<Icon name="mdi:information" class="text-4xl mb-2" />
		<p>{{ searchQuery ? 'No libraries found matching your search' : 'No libraries available for this category' }}</p>
	</div>
</template>
