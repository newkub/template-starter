<script setup lang="ts">
import type { TemplateConfig, DependencyConflict } from "#shared/types/template";
import { useDependencyConflictDetection } from "~/composables/core/useDependencyConflictDetection";

const props = defineProps<{
	templateConfig: TemplateConfig;
}>();

const { detectConflicts, getSeverityLevel, getConflictSummary, getSuggestions } =
	useDependencyConflictDetection();

const showConflictPanel = ref(false);

const conflicts = computed(() => detectConflicts(props.templateConfig));

const severityLevel = computed(() => getSeverityLevel(conflicts.value));

const conflictSummary = computed(() => getConflictSummary(conflicts.value));

const suggestions = computed(() => getSuggestions(conflicts.value));

const getSeverityColor = (severity: DependencyConflict["severity"]) => {
	switch (severity) {
		case "error":
			return "bg-red-100 text-red-800 border-red-200";
		case "warning":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "info":
			return "bg-blue-100 text-blue-800 border-blue-200";
	}
};

const getSeverityIcon = (severity: DependencyConflict["severity"]) => {
	switch (severity) {
		case "error":
			return "mdi:alert-circle";
		case "warning":
			return "mdi:alert";
		case "info":
			return "mdi:information";
	}
};

const getOverallColor = (level: "error" | "warning" | "info") => {
	switch (level) {
		case "error":
			return "bg-red-500";
		case "warning":
			return "bg-yellow-500";
		case "info":
			return "bg-blue-500";
	}
};
</script>

<template>
	<div class="conflict-panel">
		<div class="conflict-header">
			<h3 class="text-lg font-semibold">Dependency Conflicts</h3>
			<div class="header-actions">
				<div v-if="conflicts.length > 0" class="summary-badge">
					<span :class="['badge-dot', getOverallColor(severityLevel)]" />
					<span class="badge-text">
						{{ conflictSummary.errors }} errors,
						{{ conflictSummary.warnings }} warnings,
						{{ conflictSummary.info }} info
					</span>
				</div>
				<button
					@click="showConflictPanel = !showConflictPanel"
					class="toggle-btn"
				>
					{{ showConflictPanel ? "Hide" : "Show" }} Panel
				</button>
			</div>
		</div>

		<div v-if="showConflictPanel" class="conflict-content">
			<div v-if="conflicts.length === 0" class="no-conflicts">
				<div class="no-conflicts-icon">
					<Icon name="mdi:check-circle" class="text-green-500" />
				</div>
				<p class="no-conflicts-text">No dependency conflicts detected!</p>
				<p class="no-conflicts-subtext">Your template configuration looks good.</p>
			</div>

			<div v-else class="conflicts-list">
				<div
					v-for="(conflict, index) in conflicts"
					:key="index"
					:class="['conflict-item', getSeverityColor(conflict.severity)]"
				>
					<div class="conflict-header">
						<div class="conflict-icon">
							<Icon :name="getSeverityIcon(conflict.severity)" />
						</div>
						span class="conflict-severity">{{ conflict.severity.toUpperCase() }}</span>
					</div>

					<div class="conflict-details">
						<div class="conflict-libraries">
							<span class="conflict-lib">{{ conflict.library1 }}</span>
							<Icon name="mdi:close" class="conflict-separator" />
							<span class="conflict-lib">{{ conflict.library2 }}</span>
						</div>

						<p class="conflict-message">{{ conflict.message }}</p>

						<div v-if="conflict.resolution" class="conflict-resolution">
							<span class="resolution-label">Resolution:</span>
							<span class="resolution-text">{{ conflict.resolution }}</span>
						</div>

						<div v-if="conflict.alternatives && conflict.alternatives.length > 0" class="conflict-alternatives">
							<span class="alternatives-label">Alternatives:</span>
							<div class="alternatives-list">
								<span
									v-for="alt in conflict.alternatives"
									:key="alt"
									class="alternative-tag"
								>
									{{ alt }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="suggestions.length > 0" class="suggestions-section">
				<h4 class="suggestions-title">Suggestions</h4>
				<ul class="suggestions-list">
					li v-for="(suggestion, index) in suggestions" :key="index">
						{{ suggestion }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.conflict-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.conflict-header {
	@apply mb-4 flex items-center justify-between;
}

.header-actions {
	@apply flex items-center gap-3;
}

.summary-badge {
	@apply flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5;
}

.badge-dot {
	@apply h-2 w-2 rounded-full;
}

.badge-text {
	@apply text-sm font-medium text-gray-700;
}

.toggle-btn {
	@apply rounded-lg bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-primary/90;
}

.conflict-content {
	@apply space-y-4;
}

.no-conflicts {
	@apply rounded-lg bg-green-50 p-8 text-center;
}

.no-conflicts-icon {
	@apply mb-3 flex justify-center;
}

.no-conflicts-icon svg {
	@apply h-16 w-16;
}

.no-conflicts-text {
	@apply text-lg font-semibold text-green-800;
}

.no-conflicts-subtext {
	@apply text-sm text-green-600;
}

.conflicts-list {
	@apply space-y-3;
}

.conflict-item {
	@apply rounded-lg border p-4;
}

.conflict-header {
	@apply mb-3 flex items-center gap-2;
}

.conflict-icon {
	@apply h-5 w-5;
}

.conflict-severity {
	@apply text-xs font-bold uppercase;
}

.conflict-details {
	@apply space-y-2;
}

.conflict-libraries {
	@apply flex items-center gap-2;
}

.conflict-lib {
	@apply rounded bg-white/50 px-2 py-1 font-mono text-sm font-medium;
}

.conflict-separator {
	@apply h-4 w-4;
}

.conflict-message {
	@apply text-sm;
}

.conflict-resolution {
	@apply flex items-start gap-2 rounded bg-white/50 p-2;
}

.resolution-label {
	@apply text-xs font-semibold uppercase;
}

.resolution-text {
	@apply flex-1 text-sm;
}

.conflict-alternatives {
	@apply space-y-1;
}

.alternatives-label {
	@apply text-xs font-semibold uppercase;
}

.alternatives-list {
	@apply flex flex-wrap gap-1;
}

.alternative-tag {
	@apply rounded-full bg-white/50 px-2 py-0.5 text-xs font-medium;
}

.suggestions-section {
	@apply rounded-lg bg-blue-50 p-4;
}

.suggestions-title {
	@apply mb-2 text-sm font-semibold text-blue-900;
}

.suggestions-list {
	@apply list-inside list-disc space-y-1 text-sm text-blue-800;
}
</style>
