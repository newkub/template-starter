import type { MarketplaceTemplate, TemplateConfig } from "#shared/types/template";

export const useTemplateMarketplace = () => {
	const STORAGE_KEY = "marketplace-templates";

	const getMarketplaceTemplates = (): MarketplaceTemplate[] => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				return JSON.parse(data);
			}
		}
		return getInitialTemplates();
	};

	const getTemplateById = (id: string): MarketplaceTemplate | null => {
		const templates = getMarketplaceTemplates();
		return templates.find((t) => t.id === id) || null;
	};

	const getFeaturedTemplates = (): MarketplaceTemplate[] => {
		const templates = getMarketplaceTemplates();
		return templates.filter((t) => t.isFeatured);
	};

	const getPopularTemplates = (limit = 10): MarketplaceTemplate[] => {
		const templates = getMarketplaceTemplates();
		return [...templates]
			.sort((a, b) => b.stats.downloads - a.stats.downloads)
			.slice(0, limit);
	};

	const getTopRatedTemplates = (limit = 10): MarketplaceTemplate[] => {
		const templates = getMarketplaceTemplates();
		return [...templates]
			.filter((t) => t.stats.ratingCount > 0)
			.sort((a, b) => b.stats.rating - a.stats.rating)
			.slice(0, limit);
	};

	const searchTemplates = (
		query: string,
		filters?: {
			ecosystem?: string;
			tags?: string[];
			minRating?: number;
		},
	): MarketplaceTemplate[] => {
		let templates = getMarketplaceTemplates();

		if (query) {
			const lowerQuery = query.toLowerCase();
			templates = templates.filter(
				(t) =>
					t.name.toLowerCase().includes(lowerQuery) ||
					t.description.toLowerCase().includes(lowerQuery) ||
					t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
			);
		}

		if (filters?.ecosystem) {
			templates = templates.filter((t) => t.config.ecosystem === filters.ecosystem);
		}

		if (filters?.tags && filters.tags.length > 0) {
			templates = templates.filter((t) =>
				filters.tags!.some((tag) => t.tags.includes(tag)),
			);
		}

		if (filters?.minRating) {
			templates = templates.filter((t) => t.stats.rating >= filters.minRating!);
		}

		return templates;
	};

	const rateTemplate = (templateId: string, rating: number): boolean => {
		const templates = getMarketplaceTemplates();
		const templateIndex = templates.findIndex((t) => t.id === templateId);

		if (templateIndex === -1) return false;

		const template = templates[templateIndex];
		const newRatingCount = template.stats.ratingCount + 1;
		const newRating =
			(template.stats.rating * template.stats.ratingCount + rating) / newRatingCount;

		template.stats.rating = Number(newRating.toFixed(1));
		template.stats.ratingCount = newRatingCount;
		template.updatedAt = new Date().toISOString();

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
		}

		return true;
	};

	const incrementDownloads = (templateId: string): boolean => {
		const templates = getMarketplaceTemplates();
		const templateIndex = templates.findIndex((t) => t.id === templateId);

		if (templateIndex === -1) return false;

		templates[templateIndex].stats.downloads++;
		templates[templateIndex].updatedAt = new Date().toISOString();

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
		}

		return true;
	};

	const incrementViews = (templateId: string): boolean => {
		const templates = getMarketplaceTemplates();
		const templateIndex = templates.findIndex((t) => t.id === templateId);

		if (templateIndex === -1) return false;

		templates[templateIndex].stats.views++;
		templates[templateIndex].updatedAt = new Date().toISOString();

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
		}

		return true;
	};

	const publishTemplate = (
		name: string,
		description: string,
		icon: string,
		config: TemplateConfig,
		tags: string[],
		author: {
			id: string;
			name: string;
			avatar?: string;
		},
	): MarketplaceTemplate => {
		const templates = getMarketplaceTemplates();

		const newTemplate: MarketplaceTemplate = {
			id: `marketplace-${Date.now()}`,
			name,
			description,
			icon,
			config,
			author,
			stats: {
				rating: 0,
				ratingCount: 0,
				downloads: 0,
				views: 0,
			},
			tags,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isFeatured: false,
		};

		templates.push(newTemplate);

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
		}

		return newTemplate;
	};

	const getRelatedTemplates = (templateId: string, limit = 5): MarketplaceTemplate[] => {
		const template = getTemplateById(templateId);
		if (!template) return [];

		const templates = getMarketplaceTemplates().filter((t) => t.id !== templateId);

		const related = templates
			.map((t) => {
				let score = 0;

				if (t.config.ecosystem === template.config.ecosystem) score += 3;

				const commonTags = t.tags.filter((tag) => template.tags.includes(tag));
				score += commonTags.length * 2;

				const commonLibs = t.config.libraries.filter((lib) =>
					template.config.libraries.includes(lib),
				);
				score += commonLibs.length;

				return { template: t, score };
			})
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, limit)
			.map((item) => item.template);

		return related;
	};

	return {
		getMarketplaceTemplates,
		getTemplateById,
		getFeaturedTemplates,
		getPopularTemplates,
		getTopRatedTemplates,
		searchTemplates,
		rateTemplate,
		incrementDownloads,
		incrementViews,
		publishTemplate,
		getRelatedTemplates,
	};
};

function getInitialTemplates(): MarketplaceTemplate[] {
	return [
		{
			id: "marketplace-1",
			name: "Next.js E-commerce Starter",
			description: "Complete e-commerce template with Stripe integration, inventory management, and admin dashboard",
			icon: "mdi:shopping",
			config: {
				ecosystem: "next",
				libraries: ["shadcn", "zustand", "trpc", "next-auth", "prisma"],
				packageManager: "bun",
			},
			author: {
				id: "user-1",
				name: "John Doe",
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
			},
			stats: {
				rating: 4.8,
				ratingCount: 156,
				downloads: 2340,
				views: 8900,
			},
			tags: ["ecommerce", "nextjs", "stripe", "fullstack"],
			createdAt: "2024-01-15T10:00:00Z",
			updatedAt: "2024-01-20T15:30:00Z",
			isFeatured: true,
		},
		{
			id: "marketplace-2",
			name: "Nuxt Blog Starter",
			description: "Minimal blog template with MDX support, SEO optimization, and dark mode",
			icon: "mdi:post",
			config: {
				ecosystem: "nuxt",
				libraries: ["nuxt-ui", "pinia"],
				packageManager: "bun",
			},
			author: {
				id: "user-2",
				name: "Jane Smith",
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
			},
			stats: {
				rating: 4.6,
				ratingCount: 89,
				downloads: 1560,
				views: 5400,
			},
			tags: ["blog", "nuxt", "mdx", "seo"],
			createdAt: "2024-01-10T08:00:00Z",
			updatedAt: "2024-01-18T12:00:00Z",
			isFeatured: true,
		},
		{
			id: "marketplace-3",
			name: "Bun API Server",
			description: "High-performance API server with Hono, Drizzle ORM, and Zod validation",
			icon: "mdi:server",
			config: {
				ecosystem: "bun",
				libraries: ["hono", "drizzle-orm", "zod"],
				packageManager: "bun",
			},
			author: {
				id: "user-3",
				name: "Bob Wilson",
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
			},
			stats: {
				rating: 4.9,
				ratingCount: 203,
				downloads: 3200,
				views: 11200,
			},
			tags: ["api", "bun", "hono", "drizzle"],
			createdAt: "2024-01-05T14:00:00Z",
			updatedAt: "2024-01-22T09:00:00Z",
			isFeatured: true,
		},
	];
}
