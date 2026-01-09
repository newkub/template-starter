<script setup lang="ts">
import { libraryStats, ecosystemStats } from "~/shared/data/stats";

const getTrendIcon = (trend: string) => {
	switch (trend) {
		case "up":
			return "mdi:trending-up";
		case "down":
			return "mdi:trending-down";
		default:
			return "mdi:trending-neutral";
	}
};

const getTrendColor = (trend: string) => {
	switch (trend) {
		case "up":
			return "text-green-600 dark:text-green-400";
		case "down":
			return "text-red-600 dark:text-red-400";
		default:
			return "text-gray-600 dark:text-gray-400";
	}
};
</script>

<template>
	<div class="space-y-6">
		<h3 class="font-semibold text-gray-900 dark:text-gray-100">Usage Statistics</h3>

		<div>
			<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Popular Libraries</h4>
			<div class="space-y-2">
				<div
					v-for="stat in libraryStats.slice(0, 8)"
					:key="stat.id"
					class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
				>
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
							<Icon :name="getTrendIcon(stat.trend)" :class="`text-lg ${getTrendColor(stat.trend)}`" />
						</div>
						<span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ stat.name }}</span>
					</div>
					<span class="text-sm text-gray-600 dark:text-gray-400">{{ stat.usageCount.toLocaleString() }} uses</span>
				</div>
			</div>
		</div>

		<div>
			<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ecosystem Usage</h4>
			<div class="space-y-2">
				<div
					v-for="stat in ecosystemStats"
					:key="stat.id"
					class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
				>
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-3">
							<span class="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{{ stat.name }}</span>
							<span class="text-xs text-gray-500 dark:text-gray-400">{{ stat.usageCount.toLocaleString() }} templates</span>
						</div>
					</div>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="lib in stat.popularLibraries.slice(0, 3)"
							:key="lib.id"
							class="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-1"
						>
							<Icon :name="getTrendIcon(lib.trend)" :class="`text-xs ${getTrendColor(lib.trend)}`" />
							{{ lib.name }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
