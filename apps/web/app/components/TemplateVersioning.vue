<script setup lang="ts">
import type { TemplateConfig, TemplateVersion } from "#shared/types/template";
import { useTemplateVersioning } from "~/composables/core/useTemplateVersioning";

const props = defineProps<{
	templateId: string;
	currentConfig: TemplateConfig;
}>();

const emit = defineEmits<{
	rollback: [config: TemplateConfig];
}>();

const { getVersionHistory, rollbackToVersion, deleteVersion } = useTemplateVersioning();

const history = computed(() => getVersionHistory(props.templateId));
const showHistory = ref(false);
const selectedVersion = ref<TemplateVersion | null>(null);

const handleRollback = async (version: TemplateVersion) => {
	const config = rollbackToVersion(props.templateId, version.version);
	if (config) {
		emit("rollback", config);
		showHistory.value = false;
	}
};

const handleDelete = (version: string) => {
	deleteVersion(props.templateId, version);
};

const formatDate = (date: string) => {
	return new Date(date).toLocaleString();
};
</script>

<template>
	<div class="versioning-panel">
		<div class="versioning-header">
			<h3 class="text-lg font-semibold">Version History</h3>
			<button
				@click="showHistory = !showHistory"
				class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				{{ showHistory ? "Hide" : "Show" }} History
			</button>
		</div>

		<div v-if="showHistory && history" class="versioning-content">
			<div class="current-version">
				<span class="text-sm text-gray-600">Current Version:</span>
				<span class="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
					v{{ history.currentVersion }}
				</span>
			</div>

			<div class="versions-list">
				<div
					v-for="version in [...history.versions].reverse()"
					:key="version.id"
					class="version-item"
					:class="{ 'is-current': version.version === history.currentVersion }"
				>
					<div class="version-info">
						<div class="version-header">
							<span class="version-number">v{{ version.version }}</span>
							<span class="version-date">{{ formatDate(version.createdAt) }}</span>
							<span v-if="version.createdBy" class="version-author">{{ version.createdBy }}</span>
						</div>
						<ul class="version-changes">
							<li v-for="change in version.changes" :key="change">
								{{ change }}
							</li>
						</ul>
					</div>

					<div class="version-actions">
						<button
							v-if="version.version !== history.currentVersion"
							@click="handleRollback(version)"
							class="action-btn rollback"
						>
							Rollback
						</button>
						<button
							v-if="version.version !== history.currentVersion"
							@click="handleDelete(version.version)"
							class="action-btn delete"
						>
							Delete
						</button>
						span v-else class="current-badge">Current</span>
					</div>
				</div>
			</div>
		</div>

		<div v-else-if="showHistory && !history" class="no-history">
			<p>No version history available</p>
		</div>
	</div>
</template>

<style scoped>
.versioning-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.versioning-header {
	@apply mb-4 flex items-center justify-between;
}

.versioning-content {
	@apply space-y-4;
}

.current-version {
	@apply flex items-center rounded-lg bg-gray-50 p-3;
}

.versions-list {
	@apply space-y-3;
}

.version-item {
	@apply rounded-lg border border-gray-200 p-4 transition-all hover:border-primary/50;
}

.version-item.is-current {
	@apply border-green-200 bg-green-50;
}

.version-info {
	@apply mb-3;
}

.version-header {
	@apply mb-2 flex items-center gap-3;
}

.version-number {
	@apply font-semibold text-gray-900;
}

.version-date {
	@apply text-sm text-gray-500;
}

.version-author {
	@apply text-sm text-gray-600;
}

.version-changes {
	@apply list-inside list-disc space-y-1 text-sm text-gray-700;
}

.version-actions {
	@apply flex items-center gap-2;
}

.action-btn {
	@apply rounded-lg px-3 py-1.5 text-sm font-medium transition-colors;
}

.action-btn.rollback {
	@apply bg-blue-100 text-blue-700 hover:bg-blue-200;
}

.action-btn.delete {
	@apply bg-red-100 text-red-700 hover:bg-red-200;
}

.current-badge {
	@apply rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700;
}

.no-history {
	@apply rounded-lg bg-gray-50 p-6 text-center text-gray-600;
}
</style>
