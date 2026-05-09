<script setup lang="ts">
import type { Ecosystem } from "#shared/types/template";
import { useTemplateAnalytics } from "~/composables/core/useTemplateAnalytics";

const props = defineProps<{
	templateId?: string;
}>();

const {
	getTemplateStats,
	getAllEcosystemStats,
	getTrendingLibraries,
	getComparisonData,
	exportAnalytics,
} = useTemplateAnalytics();

const showAnalyticsPanel = ref(false);
const activeTab = ref<"overview" | "ecosystems" | "trending" | "comparison">("overview");
const selectedDays = ref(30);

const templateStats = computed(() =>
	props.templateId ? getTemplateStats(props.templateId, selectedDays.value) : null,
);

const ecosystemStats = computed(() => getAllEcosystemStats());

const trendingLibraries = computed(() => getTrendingLibraries(10));

const comparisonTemplateIds = ref<string[]>([]);
const comparisonData = computed(() =>
	comparisonTemplateIds.value.length > 0
		? getComparisonData(comparisonTemplateIds.value, selectedDays.value)
		: null,
);

const handleExport = () => {
	if (!props.templateId) return;

	const data = exportAnalytics(props.templateId, selectedDays.value);
	const blob = new Blob([data], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `analytics-${props.templateId}-${selectedDays.value}days.json`;
	a.click();
	URL.revokeObjectURL(url);
};

const formatNumber = (num: number) => {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
};

const getTrendIcon = (trend: "up" | "down" | "stable") => {
	switch (trend) {
		case "up":
			return "mdi:trending-up";
		case "down":
			return "mdi:trending-down";
		case "stable":
			return "mdi:trending-neutral";
	}
};

const getTrendColor = (trend: "up" | "down" | "stable") => {
	switch (trend) {
		case "up":
			return "text-green-600";
		case "down":
			return "text-red-600";
		case "stable":
			return "text-gray-600";
	}
};
</script>

<template>
	<div class="analytics-panel">
		<div class="analytics-header">
			<h3 class="text-lg font-semibold">Analytics Dashboard</h3>
			<div class="header-actions">
				<select v-model="selectedDays" class="days-select">
					<option :value="7">Last 7 days</option>
					<option :value="30">Last 30 days</option>
					<option :value="90">Last 90 days</option>
				</select>
				<button
					v-if="templateId"
					@click="handleExport"
					class="export-btn"
				>
					<Icon name="mdi:download" />
					Export
				</button>
				<button
					@click="showAnalyticsPanel = !showAnalyticsPanel"
					class="toggle-btn"
				>
					{{ showAnalyticsPanel ? "Hide" : "Show" }} Panel
				</button>
			</div>
		</div>

		<div v-if="showAnalyticsPanel" class="analytics-content">
			<div class="tabs">
				<button
					:class="['tab', { active: activeTab === 'overview' }]"
					@click="activeTab = 'overview'"
				>
					Overview
				</button>
				<button
					:class="['tab', { active: activeTab === 'ecosystems' }]"
					@click="activeTab = 'ecosystems'"
				>
					Ecosystems
				</button>
				<button
					:class="['tab', { active: activeTab === 'trending' }]"
					@click="activeTab = 'trending'"
				>
					Trending
				</button>
				<button
					:class="['tab', { active: activeTab === 'comparison' }]"
					@click="activeTab = 'comparison'"
				>
					Comparison
				</button>
			</div>

			<div v-if="activeTab === 'overview'" class="overview-section">
				<div v-if="templateStats" class="stats-grid">
					<div class="stat-card">
						<div class="stat-icon views">
							<Icon name="mdi:eye" />
						</div>
						<div class="stat-content">
							<span class="stat-value">{{ formatNumber(templateStats.totalViews) }}</span>
							<span class="stat-label">Total Views</span>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon downloads">
							<Icon name="mdi:download" />
						</div>
						<div class="stat-content">
							<span class="stat-value">{{ formatNumber(templateStats.totalDownloads) }}</span>
							<span class="stat-label">Downloads</span>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon generations">
							<Icon name="mdi:cog" />
						</div>
						<div class="stat-content">
							<span class="stat-value">{{ formatNumber(templateStats.totalGenerations) }}</span>
							<span class="stat-label">Generations</span>
						</div>
					</div>

					<div class="stat-card">
						<div class="stat-icon deployments">
							<Icon name="mdi:rocket-launch" />
						</div>
						<div class="stat-content">
							<span class="stat-value">{{ formatNumber(templateStats.totalDeployments) }}</span>
							<span class="stat-label">Deployments</span>
						</div>
					</div>
				</div>

				<div v-if="templateStats && templateStats.popularLibraries.length > 0" class="popular-libraries">
					<h4 class="section-title">Popular Libraries</h4>
					<div class="libraries-list">
						<div
							v-for="lib in templateStats.popularLibraries"
							:key="lib.libraryId"
							class="library-item"
						>
							<span class="library-name">{{ lib.libraryId }}</span>
							<span class="library-count">{{ formatNumber(lib.count) }}</span>
						</div>
					</div>
				</div>

				<div v-else class="no-data">
					<p>No analytics data available</p>
				</div>
			</div>

			<div v-if="activeTab === 'ecosystems'" class="ecosystems-section">
				<div class="ecosystems-grid">
					<div
						v-for="stat in ecosystemStats"
						:key="stat.id"
						class="ecosystem-card"
					>
						<div class="ecosystem-header">
							<h5 class="ecosystem-name">{{ stat.name }}</h5>
							<span class="ecosystem-count">{{ formatNumber(stat.usageCount) }} templates</span>
						</div>

						<div class="ecosystem-libraries">
							<h6 class="libraries-title">Top Libraries</h6>
							<div class="libraries-list">
								<div
									v-for="lib in stat.popularLibraries.slice(0, 5)"
									:key="lib.id"
									class="library-item"
								>
									<span class="library-name">{{ lib.name }}</span>
									<div class="library-stats">
										<span class="library-count">{{ formatNumber(lib.usageCount) }}</span>
										<Icon
											:name="getTrendIcon(lib.trend)"
											:class="['trend-icon', getTrendColor(lib.trend)]"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="activeTab === 'trending'" class="trending-section">
				<h4 class="section-title">Trending Libraries</h4>
				<div class="trending-list">
					<div
						v-for="(lib, index) in trendingLibraries"
						:key="lib.id"
						class="trending-item"
					>
						<span class="trending-rank">#{{ index + 1 }}</span>
						<span class="trending-name">{{ lib.name }}</span>
						<span class="trending-count">{{ formatNumber(lib.usageCount) }}</span>
						<Icon
							:name="getTrendIcon(lib.trend)"
							:class="['trending-icon', getTrendColor(lib.trend)]"
						/>
					</div>
				</div>
			</div>

			<div v-if="activeTab === 'comparison'" class="comparison-section">
				<div class="comparison-input">
					<label class="input-label">Compare Templates (comma-separated IDs)</label>
					<input
						v-model="comparisonTemplateIds"
						type="text"
						class="input-field"
						placeholder="template-1, template-2, template-3"
					/>
				</div>

				<div v-if="comparisonData && comparisonData.length > 0" class="comparison-results">
					<div class="comparison-table">
						<table>
							<thead>
								<tr>
									th>Template</th>
									<th>Views</th>
									<th>Downloads</th>
									<th>Generations</th>
									<th>Deployments</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="data in comparisonData" :key="data.templateId">
									<td>{{ data.templateId }}</td>
									<td>{{ formatNumber(data.totalViews) }}</td>
									<td>{{ formatNumber(data.totalDownloads) }}</td>
									<td>{{ formatNumber(data.totalGenerations) }}</td>
									<td>{{ formatNumber(data.totalDeployments) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div v-else class="no-comparison">
					<p>Enter template IDs to compare</p>
				</div>
			</div>
		</div>
	</template>

<style scoped>
.analytics-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.analytics-header {
	@apply mb-4 flex items-center justify-between;
}

.header-actions {
	@apply flex items-center gap-2;
}

.days-select {
	@apply rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.export-btn,
.toggle-btn {
	@apply flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-primary/90;
}

.analytics-content {
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

.overview-section,
.ecosystems-section,
.trending-section,
.comparison-section {
	@apply space-y-4;
}

.stats-grid {
	@apply grid gap-4 sm:grid-cols-2 lg:grid-cols-4;
}

.stat-card {
	@apply flex items-center gap-4 rounded-lg border border-gray-200 p-4;
}

.stat-icon {
	@apply flex h-12 w-12 items-center justify-center rounded-lg text-white;
}

.stat-icon.views {
	@apply bg-blue-500;
}

.stat-icon.downloads {
	@apply bg-green-500;
}

.stat-icon.generations {
	@apply bg-purple-500;
}

.stat-icon.deployments {
	@apply bg-orange-500;
}

.stat-content {
	@apply flex flex-col;
}

.stat-value {
	@apply text-2xl font-bold text-gray-900;
}

.stat-label {
	@apply text-sm text-gray-600;
}

.popular-libraries {
	@apply rounded-lg border border-gray-200 p-4;
}

.section-title {
	@apply mb-3 text-sm font-semibold text-gray-700;
}

.libraries-list {
	@apply space-y-2;
}

.library-item {
	@apply flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2;
}

.library-name {
	@apply font-medium text-gray-900;
}

.library-count {
	@apply text-sm text-gray-600;
}

.no-data,
.no-comparison {
	@apply rounded-lg bg-gray-50 p-6 text-center text-gray-600;
}

.ecosystems-grid {
	@apply grid gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.ecosystem-card {
	@apply rounded-lg border border-gray-200 p-4;
}

.ecosystem-header {
	@apply mb-3 flex items-center justify-between;
}

.ecosystem-name {
	@apply font-semibold text-gray-900;
}

.ecosystem-count {
	@apply text-sm text-gray-600;
}

.ecosystem-libraries {
	@apply space-y-2;
}

.libraries-title {
	@apply text-xs font-semibold text-gray-700 uppercase;
}

.library-stats {
	@apply flex items-center gap-2;
}

.trend-icon {
	@apply h-4 w-4;
}

.trending-list {
	@apply space-y-2;
}

.trending-item {
	@apply flex items-center gap-4 rounded-lg border border-gray-200 p-3;
}

.trending-rank {
	@apply flex h-8 w-8 items-center justify-center rounded-full bg-primary font-semibold text-white;
}

.trending-name {
	@apply flex-1 font-medium text-gray-900;
}

.trending-count {
	@apply text-sm text-gray-600;
}

.trending-icon {
	@apply h-5 w-5;
}

.comparison-input {
	@apply space-y-2;
}

.input-label {
	@apply text-sm font-medium text-gray-700;
}

.input-field {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.comparison-table {
	@apply overflow-x-auto rounded-lg border border-gray-200;
}

.comparison-table table {
	@apply w-full;
}

.comparison-table th {
	@apply border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700;
}

.comparison-table td {
	@apply border-b border-gray-200 px-4 py-3 text-sm text-gray-900;
}

.comparison-table tr:last-child td {
	@apply border-b-0;
}
</style>
