<script setup lang="ts">
import { computed } from "vue";
import type { TemplateConfig, CompatibilityIssue } from "~/shared/types/template";
import { useCompatibility } from "~/composables/core/useCompatibility";

interface Props {
	config: TemplateConfig | null;
}

const props = defineProps<Props>();

const { checkCompatibility, getSeverity, isCompatible } = useCompatibility();

const issues = computed(() => {
	if (!props.config) return [];
	return checkCompatibility(props.config);
});

const severity = computed(() => {
	return getSeverity(issues.value);
});

const compatible = computed(() => {
	return isCompatible(issues.value);
});

const getIssueIcon = (type: string) => {
	switch (type) {
		case "conflict":
			return "mdi:alert-circle";
		case "warning":
			return "mdi:alert";
		case "suggestion":
			return "mdi:lightbulb";
		default:
			return "mdi:information";
	}
};

const getIssueColor = (type: string) => {
	switch (type) {
		case "conflict":
			return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
		case "warning":
			return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
		case "suggestion":
			return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
		default:
			return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
	}
};
</script>

<template>
	<div v-if="config" class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Compatibility Check</h3>
			<div
				class="px-3 py-1.5 text-sm rounded-full font-medium flex items-center gap-2"
				:class="compatible ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'"
			>
				<Icon :name="compatible ? 'mdi:check-circle' : 'mdi:alert-circle'" class="text-base" />
				{{ compatible ? "Compatible" : "Issues Found" }}
			</div>
		</div>

		<div v-if="issues.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
			<Icon name="mdi:check-circle-outline" class="text-4xl mb-2 text-green-500" />
			<p class="text-sm">No compatibility issues detected</p>
		</div>

		<div v-else class="space-y-3">
			<div
				v-for="(issue, index) in issues"
				:key="index"
				class="p-4 rounded-lg border-2"
				:class="getIssueColor(issue.type)"
			>
				<div class="flex items-start gap-3">
					<Icon :name="getIssueIcon(issue.type)" class="text-xl mt-0.5" />
					<div class="flex-1">
						<p class="text-sm font-medium">{{ issue.message }}</p>
						<div v-if="issue.libraries.length > 0" class="mt-2 flex flex-wrap gap-2">
							<span
								v-for="lib in issue.libraries"
								:key="lib"
								class="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-950 border border-current opacity-70"
							>
								{{ lib }}
							</span>
						</div>
						<div v-if="issue.alternatives && issue.alternatives.length > 0" class="mt-2">
							<p class="text-xs font-medium mb-1">Alternatives:</p>
							<div class="flex flex-wrap gap-1">
								<span
									v-for="alt in issue.alternatives"
									:key="alt"
									class="px-2 py-0.5 text-xs rounded bg-white dark:bg-gray-950 border border-current"
								>
									{{ alt }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
