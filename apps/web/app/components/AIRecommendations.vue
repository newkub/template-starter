<script setup lang="ts">
import type { Ecosystem, LibraryRecommendation } from "#shared/types/template";
import { useLibraryRecommendations } from "~/composables/core/useLibraryRecommendations";

const props = defineProps<{
	ecosystem: Ecosystem;
	selectedLibraries: string[];
}>();

const emit = defineEmits<{
	select: [libraryId: string];
}>();

const { getSmartRecommendations, getCompatibilitySuggestions } = useLibraryRecommendations();

const activeTab = ref<"smart" | "compatibility">("smart");
const showRecommendations = ref(false);

const smartRecommendations = computed(() =>
	getSmartRecommendations(props.ecosystem, props.selectedLibraries),
);

const compatibilitySuggestions = computed(() =>
	getCompatibilitySuggestions(props.ecosystem, props.selectedLibraries),
);

const allRecommendations = computed(() => {
	if (activeTab.value === "smart") return smartRecommendations.value;
	return compatibilitySuggestions.value;
});

const handleSelect = (libraryId: string) => {
	emit("select", libraryId);
};

const getConfidenceColor = (confidence: number) => {
	if (confidence >= 0.8) return "bg-green-500";
	if (confidence >= 0.5) return "bg-yellow-500";
	return "bg-gray-500";
};
</script>

<template>
	<div class="recommendations-panel">
		<div class="recommendations-header">
			<h3 class="text-lg font-semibold">AI Recommendations</h3>
			<button
				@click="showRecommendations = !showRecommendations"
				class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				{{ showRecommendations ? "Hide" : "Show" }} Recommendations
			</button>
		</div>

		<div v-if="showRecommendations" class="recommendations-content">
			<div class="tabs">
				<button
					:class="['tab', { active: activeTab === 'smart' }]"
					@click="activeTab = 'smart'"
				>
					Smart Recommendations
				</button>
				<button
					:class="['tab', { active: activeTab === 'compatibility' }]"
					@click="activeTab = 'compatibility'"
				>
					Compatibility Suggestions
				</button>
			</div>

			<div v-if="allRecommendations.length > 0" class="recommendations-list">
				<div
					v-for="rec in allRecommendations"
					:key="rec.library.id"
					class="recommendation-item"
				>
					<div class="recommendation-info">
						<div class="library-header">
							<div class="library-icon">
								<Icon :name="rec.library.icon" />
							</div>
							<div class="library-details">
								<h4 class="library-name">{{ rec.library.name }}</h4>
								<p class="library-description">{{ rec.library.description }}</p>
							</div>
						</div>

						<div class="recommendation-meta">
							<div class="confidence-bar">
								<span class="confidence-label">Confidence:</span>
								<div class="confidence-track">
									<div
										class="confidence-fill"
										:class="getConfidenceColor(rec.confidence)"
										:style="{ width: `${rec.confidence * 100}%` }"
									/>
								</div>
								<span class="confidence-value">{{ Math.round(rec.confidence * 100) }}%</span>
							</div>

							<p class="recommendation-reason">{{ rec.reason }}</p>

							<div v-if="rec.relatedLibraries && rec.relatedLibraries.length > 0" class="related-libraries">
								<span class="related-label">Related:</span>
								<span v-for="libId in rec.relatedLibraries" :key="libId" class="related-tag">
									{{ libId }}
								</span>
							</div>
						</div>
					</div>

					<button
						@click="handleSelect(rec.library.id)"
						class="add-btn"
					>
						Add
					</button>
				</div>
			</div>

			<div v-else class="no-recommendations">
				<p>No recommendations available</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.recommendations-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.recommendations-header {
	@apply mb-4 flex items-center justify-between;
}

.recommendations-content {
	@apply space-y-4;
}

.tabs {
	@apply flex gap-2 rounded-lg bg-gray-100 p-1;
}

.tab {
	@apply rounded-md px-4 py-2 text-sm font-medium transition-colors;
}

.tab.active {
	@apply bg-white text-primary shadow-sm;
}

.recommendations-list {
	@apply space-y-3;
}

.recommendation-item {
	@apply rounded-lg border border-gray-200 p-4 transition-all hover:border-primary/50;
}

.recommendation-info {
	@apply mb-3;
}

.library-header {
	@apply mb-3 flex items-start gap-3;
}

.library-icon {
	@apply flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary;
}

.library-details {
	@apply flex-1;
}

.library-name {
	@apply font-semibold text-gray-900;
}

.library-description {
	@apply mt-1 text-sm text-gray-600;
}

.recommendation-meta {
	@apply space-y-2;
}

.confidence-bar {
	@apply flex items-center gap-2;
}

.confidence-label {
	@apply text-sm font-medium text-gray-700;
}

.confidence-track {
	@apply h-2 flex-1 overflow-hidden rounded-full bg-gray-200;
}

.confidence-fill {
	@apply h-full transition-all duration-300;
}

.confidence-value {
	@apply text-sm font-semibold text-gray-700;
}

.recommendation-reason {
	@apply text-sm text-gray-600;
}

.related-libraries {
	@apply flex items-center gap-2 flex-wrap;
}

.related-label {
	@apply text-sm font-medium text-gray-700;
}

.related-tag {
	@apply rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700;
}

.add-btn {
	@apply w-full rounded-lg bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-primary/90;
}

.no-recommendations {
	@apply rounded-lg bg-gray-50 p-6 text-center text-gray-600;
}
</style>
