import type { AnalyticsData, Ecosystem, EcosystemStats, LibraryStats } from "#shared/types/template";

export const useTemplateAnalytics = () => {
	const STORAGE_KEY = "analytics-data";

	const getAnalyticsData = (templateId: string, days = 30): AnalyticsData[] => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const allData = JSON.parse(data) as Record<string, AnalyticsData[]>;
				const templateData = allData[templateId] || [];

				const cutoffDate = new Date();
				cutoffDate.setDate(cutoffDate.getDate() - days);

				return templateData.filter((d) => new Date(d.date) >= cutoffDate);
			}
		}
		return [];
	};

	const recordAnalytics = (
		templateId: string,
		metricType: "view" | "download" | "generation" | "deployment",
		libraryId?: string,
	): void => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const allData = data ? JSON.parse(data) : {};

			const today = new Date().toISOString().split("T")[0];
			const templateData = allData[templateId] || [];

			const todayData = templateData.find((d: AnalyticsData) => d.date === today);

			if (todayData) {
				switch (metricType) {
					case "view":
						todayData.metrics.views++;
						break;
					case "download":
						todayData.metrics.downloads++;
						break;
					case "generation":
						todayData.metrics.generations++;
						break;
					case "deployment":
						todayData.metrics.deployments++;
						break;
				}

				if (libraryId) {
					const libIndex = todayData.popularLibraries.findIndex((l) => l.libraryId === libraryId);
					if (libIndex >= 0) {
						todayData.popularLibraries[libIndex].count++;
					} else {
						todayData.popularLibraries.push({ libraryId, count: 1 });
					}
				}
			} else {
				const newAnalytics: AnalyticsData = {
					templateId,
					date: today,
					metrics: {
						views: metricType === "view" ? 1 : 0,
						downloads: metricType === "download" ? 1 : 0,
						generations: metricType === "generation" ? 1 : 0,
						deployments: metricType === "deployment" ? 1 : 0,
					},
					popularLibraries: libraryId ? [{ libraryId, count: 1 }] : [],
				};

				templateData.push(newAnalytics);
			}

			allData[templateId] = templateData;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
		}
	};

	const getTemplateStats = (templateId: string, days = 30) => {
		const analyticsData = getAnalyticsData(templateId, days);

		const totalViews = analyticsData.reduce((sum, d) => sum + d.metrics.views, 0);
		const totalDownloads = analyticsData.reduce((sum, d) => sum + d.metrics.downloads, 0);
		const totalGenerations = analyticsData.reduce((sum, d) => sum + d.metrics.generations, 0);
		const totalDeployments = analyticsData.reduce((sum, d) => sum + d.metrics.deployments, 0);

		const libraryUsage = new Map<string, number>();
		analyticsData.forEach((d) => {
			d.popularLibraries.forEach((lib) => {
				libraryUsage.set(lib.libraryId, (libraryUsage.get(lib.libraryId) || 0) + lib.count);
			});
		});

		const popularLibraries = Array.from(libraryUsage.entries())
			.map(([libraryId, count]) => ({ libraryId, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		const dailyData = analyticsData.map((d) => ({
			date: d.date,
			views: d.metrics.views,
			downloads: d.metrics.downloads,
			generations: d.metrics.generations,
			deployments: d.metrics.deployments,
		}));

		return {
			totalViews,
			totalDownloads,
			totalGenerations,
			totalDeployments,
			popularLibraries,
			dailyData,
		};
	};

	const getEcosystemStats = (ecosystem: Ecosystem): EcosystemStats => {
		const config = ecosystemConfigs.find((ec) => ec.id === ecosystem);
		if (!config) {
			return {
				id: ecosystem,
				name: ecosystem,
				usageCount: 0,
				popularLibraries: [],
			};
		}

		const allLibraries = Object.values(config.libraries).flat();

		const popularLibraries: LibraryStats[] = allLibraries.map((lib) => ({
			id: lib.id,
			name: lib.name,
			usageCount: Math.floor(Math.random() * 1000),
			trend: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
		}));

		popularLibraries.sort((a, b) => b.usageCount - a.usageCount);

		return {
			id: ecosystem,
			name: config.name,
			usageCount: Math.floor(Math.random() * 10000),
			popularLibraries: popularLibraries.slice(0, 10),
		};
	};

	const getAllEcosystemStats = (): EcosystemStats[] => {
		const ecosystems: Ecosystem[] = ["bun", "next", "nuxt", "flutter", "kotlin"];
		return ecosystems.map((ecosystem) => getEcosystemStats(ecosystem));
	};

	const getTrendingLibraries = (limit = 10): LibraryStats[] => {
		const allStats = getAllEcosystemStats();
		const allLibraries = allStats.flatMap((stats) => stats.popularLibraries);

		const trending = allLibraries
			.filter((lib) => lib.trend === "up")
			.sort((a, b) => b.usageCount - a.usageCount)
			.slice(0, limit);

		return trending;
	};

	const getComparisonData = (templateIds: string[], days = 30) => {
		const comparison = templateIds.map((id) => {
			const stats = getTemplateStats(id, days);
			return {
				templateId: id,
				...stats,
			};
		});

		return comparison;
	};

	const clearAnalytics = (templateId?: string): void => {
		if (import.meta.client) {
			if (templateId) {
				const data = localStorage.getItem(STORAGE_KEY);
				if (data) {
					const allData = JSON.parse(data);
					delete allData[templateId];
					localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
				}
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	};

	const exportAnalytics = (templateId: string, days = 30): string => {
		const analyticsData = getAnalyticsData(templateId, days);
		return JSON.stringify(analyticsData, null, 2);
	};

	return {
		getAnalyticsData,
		recordAnalytics,
		getTemplateStats,
		getEcosystemStats,
		getAllEcosystemStats,
		getTrendingLibraries,
		getComparisonData,
		clearAnalytics,
		exportAnalytics,
	};
};
