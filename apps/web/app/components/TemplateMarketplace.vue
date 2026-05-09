<script setup lang="ts">
import type { Ecosystem, MarketplaceTemplate } from "#shared/types/template";
import { useTemplateMarketplace } from "~/composables/core/useTemplateMarketplace";

const props = defineProps<{
	ecosystem?: Ecosystem;
}>();

const emit = defineEmits<{
	select: [template: MarketplaceTemplate];
}>();

const {
	getMarketplaceTemplates,
	getFeaturedTemplates,
	getPopularTemplates,
	getTopRatedTemplates,
	searchTemplates,
	incrementDownloads,
} = useTemplateMarketplace();

const activeTab = ref<"featured" | "popular" | "top-rated" | "search">("featured");
const searchQuery = ref("");
const selectedTags = ref<string[]>([]);

const featuredTemplates = computed(() => getFeaturedTemplates());
const popularTemplates = computed(() => getPopularTemplates());
const topRatedTemplates = computed(() => getTopRatedTemplates());

const searchResults = computed(() => {
	if (!searchQuery.value && selectedTags.value.length === 0) return [];
	return searchTemplates(searchQuery.value, {
		ecosystem: props.ecosystem,
		tags: selectedTags.value,
		minRating: 3,
	});
});

const displayTemplates = computed(() => {
	switch (activeTab.value) {
		case "featured":
			return featuredTemplates.value;
		case "popular":
			return popularTemplates.value;
		case "top-rated":
			return topRatedTemplates.value;
		case "search":
			return searchResults.value;
		default:
			return [];
	}
});

const allTags = computed(() => {
	const templates = getMarketplaceTemplates();
	const tags = new Set<string>();
	templates.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
	return Array.from(tags);
});

const handleSelect = (template: MarketplaceTemplate) => {
	incrementDownloads(template.id);
	emit("select", template);
};

const toggleTag = (tag: string) => {
	const index = selectedTags.value.indexOf(tag);
	if (index === -1) {
		selectedTags.value.push(tag);
	} else {
		selectedTags.value.splice(index, 1);
	}
};

const formatNumber = (num: number) => {
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}k`;
	}
	return num.toString();
};

const renderStars = (rating: number) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return {
		full: fullStars,
		half: hasHalfStar ? 1 : 0,
		empty: emptyStars,
	};
};
</script>

<template>
	<div class="marketplace-panel">
		<div class="marketplace-header">
			<h3 class="text-lg font-semibold">Template Marketplace</h3>
		</div>

		<div class="marketplace-content">
			<div class="tabs">
				<button
					:class="['tab', { active: activeTab === 'featured' }]"
					@click="activeTab = 'featured'"
				>
					Featured
				</button>
				<button
					:class="['tab', { active: activeTab === 'popular' }]"
					@click="activeTab = 'popular'"
				>
					Popular
				</button>
				<button
					:class="['tab', { active: activeTab === 'top-rated' }]"
					@click="activeTab = 'top-rated'"
				>
					Top Rated
				</button>
				<button
					:class="['tab', { active: activeTab === 'search' }]"
					@click="activeTab = 'search'"
				>
					Search
				</button>
			</div>

			<div v-if="activeTab === 'search'" class="search-section">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search templates..."
					class="search-input"
				/>

				<div class="tags-filter">
					<span class="tags-label">Filter by tags:</span>
					<button
						v-for="tag in allTags"
						:key="tag"
						:class="['tag-btn', { active: selectedTags.includes(tag) }]"
						@click="toggleTag(tag)"
					>
						{{ tag }}
					</button>
				</div>
			</div>

			<div v-if="displayTemplates.length > 0" class="templates-grid">
				<div
					v-for="template in displayTemplates"
					:key="template.id"
					class="template-card"
					@click="handleSelect(template)"
				>
					<div class="template-header">
						<div class="template-icon">
							<Icon :name="template.icon" />
						</div>
						<div class="template-info">
							<h4 class="template-name">{{ template.name }}</h4>
							<div class="template-author">
								<img
									v-if="template.author.avatar"
									:src="template.author.avatar"
									:alt="template.author.name"
									class="author-avatar"
								/>
								<span class="author-name">{{ template.author.name }}</span>
							</div>
						</div>
						<span v-if="template.isFeatured" class="featured-badge">Featured</span>
					</div>

					<p class="template-description">{{ template.description }}</p>

					<div class="template-tags">
						<span v-for="tag in template.tags" :key="tag" class="tag">
							{{ tag }}
						</span>
					</div>

					<div class="template-stats">
						<div class="stat-item">
							<Icon name="mdi:star" class="stat-icon" />
							<span class="stat-value">{{ template.stats.rating }}</span>
							<span class="stat-label">({{ template.stats.ratingCount }})</span>
						</div>
						<div class="stat-item">
							<Icon name="mdi:download" class="stat-icon" />
							<span class="stat-value">{{ formatNumber(template.stats.downloads) }}</span>
						</div>
						<div class="stat-item">
							<Icon name="mdi:eye" class="stat-icon" />
							<span class="stat-value">{{ formatNumber(template.stats.views) }}</span>
						</div>
					</div>

					<div class="template-ecosystem">
						<Icon :name="getEcosystemIcon(template.config.ecosystem)" />
						<span>{{ template.config.ecosystem }}</span>
					</div>
				</div>
			</div>

			<div v-else class="no-templates">
				<p>No templates found</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.marketplace-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.marketplace-header {
	@apply mb-4;
}

.marketplace-content {
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

.search-section {
	@apply space-y-3;
}

.search-input {
	@apply w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.tags-filter {
	@apply flex flex-wrap items-center gap-2;
}

.tags-label {
	@apply text-sm font-medium text-gray-700;
}

.tag-btn {
	@apply rounded-full border border-gray-300 px-3 py-1 text-sm transition-colors hover:border-primary;
}

.tag-btn.active {
	@apply border-primary bg-primary text-white;
}

.templates-grid {
	@apply grid gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.template-card {
	@apply cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-primary/50 hover:shadow-md;
}

.template-header {
	@apply mb-3 flex items-start gap-3;
}

.template-icon {
	@apply flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl;
}

.template-info {
	@apply flex-1;
}

.template-name {
	@apply font-semibold text-gray-900;
}

.template-author {
	@apply mt-1 flex items-center gap-2;
}

.author-avatar {
	@apply h-5 w-5 rounded-full;
}

.author-name {
	@apply text-sm text-gray-600;
}

.featured-badge {
	@apply rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800;
}

.template-description {
	@apply mb-3 text-sm text-gray-600 line-clamp-2;
}

.template-tags {
	@apply mb-3 flex flex-wrap gap-1;
}

.tag {
	@apply rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700;
}

.template-stats {
	@apply mb-3 flex items-center gap-4;
}

.stat-item {
	@apply flex items-center gap-1;
}

.stat-icon {
	@apply h-4 w-4 text-gray-500;
}

.stat-value {
	@apply text-sm font-semibold text-gray-700;
}

.stat-label {
	@apply text-xs text-gray-500;
}

.template-ecosystem {
	@apply flex items-center gap-1 text-sm text-gray-600;
}

.no-templates {
	@apply rounded-lg bg-gray-50 p-6 text-center text-gray-600;
}
</style>
