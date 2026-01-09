import type { TemplateConfig, GeneratedTemplate } from "~~/shared/types/template";

type TabType = "build" | "presets" | "history" | "saved" | "stats" | "comparison";

export const useTemplatePageStore = defineStore("templatePage", () => {
	const activeTab = ref<TabType>("build");
	const showPreview = ref(false);
	const comparisonConfigs = ref<TemplateConfig[]>([]);
	const generatedTemplate = ref<GeneratedTemplate | null>(null);

	const setActiveTab = (tab: TabType) => {
		activeTab.value = tab;
	};

	const setShowPreview = (show: boolean) => {
		showPreview.value = show;
	};

	const setGeneratedTemplate = (template: GeneratedTemplate | null) => {
		generatedTemplate.value = template;
	};

	const addToComparison = (config: TemplateConfig) => {
		if (comparisonConfigs.value.length >= 3) return false;

		const exists = comparisonConfigs.value.some(
			(c) => c.ecosystem === config.ecosystem && JSON.stringify(c.libraries) === JSON.stringify(config.libraries)
		);

		if (!exists) {
			comparisonConfigs.value.push(config);
			return true;
		}
		return false;
	};

	const clearComparison = () => {
		comparisonConfigs.value = [];
	};

	return {
		activeTab,
		showPreview,
		comparisonConfigs,
		generatedTemplate,
		setActiveTab,
		setShowPreview,
		setGeneratedTemplate,
		addToComparison,
		clearComparison,
	};
});
