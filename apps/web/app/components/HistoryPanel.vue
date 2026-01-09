<script setup lang="ts">
import type { TemplateConfig } from "~/shared/types/template";
import { useHistory } from "~/composables/core/useHistory";

interface Props {
	onLoad: (config: TemplateConfig) => void;
}

const props = defineProps<Props>();

const { recentHistory, removeFromHistory, clearHistory, loadFromHistory } = useHistory();

const handleLoad = (id: string) => {
	const config = loadFromHistory(id);
	if (config) {
		props.onLoad(config);
	}
};

const handleDelete = (id: string) => {
	removeFromHistory(id);
};

const handleClearAll = () => {
	if (confirm("Are you sure you want to clear all history?")) {
		clearHistory();
	}
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString();
};
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Recent Templates</h3>
			<button
				v-if="recentHistory.length > 0"
				@click="handleClearAll"
				class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
			>
				Clear All
			</button>
		</div>

		<div v-if="recentHistory.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
			<Icon name="mdi:history" class="text-4xl mb-2" />
			<p class="text-sm">No recent templates</p>
		</div>

		<div v-else class="space-y-2">
			<div
				v-for="item in recentHistory"
				:key="item.id"
				class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
				@click="handleLoad(item.id)"
			>
				<div class="flex items-center justify-between">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{{ item.config.ecosystem }}</span>
							<span class="text-xs text-gray-500 dark:text-gray-400">•</span>
							<span class="text-xs text-gray-500 dark:text-gray-400">{{ item.config.libraries.length }} libraries</span>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(item.createdAt) }}</p>
					</div>
					<button
						@click.stop="handleDelete(item.id)"
						class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
						title="Remove"
					>
						<Icon name="mdi:close" class="text-lg" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
