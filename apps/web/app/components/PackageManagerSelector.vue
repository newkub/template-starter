<script setup lang="ts">
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";

const { selectedPackageManager, packageManagers } = useTemplateSelector();
</script>

<template>
	<div class="space-y-3">
		<label class="text-sm font-medium text-gray-900 dark:text-gray-100">Package Manager</label>
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Select package manager">
			<button
				v-for="pm in packageManagers"
				:key="pm.id"
				@click="selectedPackageManager = pm.id"
				role="radio"
				:aria-checked="selectedPackageManager === pm.id"
				:aria-label="`Select ${pm.name} package manager`"
				class="p-3 rounded-lg border-2 text-center transition-all hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
				:class="selectedPackageManager === pm.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
			>
				<div class="flex flex-col items-center gap-2">
					<Icon :name="pm.icon" class="text-2xl" />
					<div class="font-semibold text-sm text-gray-900 dark:text-gray-100">{{ pm.name }}</div>
				</div>
			</button>
		</div>
	</div>
</template>
