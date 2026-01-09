<script setup lang="ts">
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";

const { selectedEcosystem, ecosystems } = useTemplateSelector();
</script>

<template>
	<div class="space-y-3">
		<label class="text-sm font-medium text-gray-900 dark:text-gray-100">Framework</label>
		<div class="space-y-2" role="radiogroup" aria-label="Select framework">
			<button
				v-for="eco in ecosystems"
				:key="eco.id"
				@click="selectedEcosystem = eco.id"
				role="radio"
				:aria-checked="selectedEcosystem === eco.id"
				:aria-label="`Select ${eco.name} framework`"
				class="w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
				:class="selectedEcosystem === eco.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
			>
				<div class="flex items-center gap-2 sm:gap-3">
					<Icon :name="eco.icon" class="text-xl sm:text-2xl" />
					<div>
						<div class="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{{ eco.name }}</div>
						<div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ eco.description }}</div>
					</div>
				</div>
			</button>
		</div>
	</div>
</template>
