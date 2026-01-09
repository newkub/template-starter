<script setup lang="ts">
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";

const { activeCategory, libraryCategories } = useTemplateSelector();
</script>

<template>
	<div class="space-y-2">
		<label class="text-sm font-medium text-gray-900 dark:text-gray-100">Library Categories</label>
		<div class="flex flex-wrap gap-2" role="tablist" aria-label="Library categories">
			<button
				v-for="cat in libraryCategories"
				:key="cat.id"
				@click="activeCategory = cat.id"
				role="tab"
				:aria-selected="activeCategory === cat.id"
				:aria-label="`Show ${cat.name} libraries`"
				class="px-3 py-2 sm:px-4 rounded-lg border transition-all hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-xs sm:text-sm"
				:class="activeCategory === cat.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
			>
				<div class="flex items-center gap-2">
					<Icon :name="cat.icon" class="text-xs sm:text-sm" />
					<span class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{{ cat.name }}</span>
				</div>
			</button>
		</div>
	</div>
</template>
