import type { TemplateConfig } from "~~/shared/types/template";
import { useTemplateSelector } from "~/composables/facade/useTemplateSelector";
import { useHistory } from "~/composables/core/useHistory";
import { useTemplateGenerator } from "~/composables/core/useTemplateGenerator";
import { useTemplatePageStore } from "~/stores/templatePage";

export function useTemplatePage() {
	const { selectedEcosystem, selectedLibraries, generateTemplate: generateTemplateConfig } = useTemplateSelector();
	const { addToHistory } = useHistory();
	const { generateTemplate } = useTemplateGenerator();
	const pageStore = useTemplatePageStore();

	const steps = computed(() => [
		{
			id: 1,
			label: "Choose Framework",
			icon: "mdi:code-tags",
			completed: selectedEcosystem.value !== undefined,
			current: true,
		},
		{
			id: 2,
			label: "Select Libraries",
			icon: "mdi:library",
			completed: selectedLibraries.value.size > 0,
			current: selectedEcosystem.value !== undefined,
		},
		{
			id: 3,
			label: "Review & Generate",
			icon: "mdi:rocket-launch",
			completed: false,
			current: selectedLibraries.value.size > 0,
		},
	]);

	const currentConfig = computed<TemplateConfig | null>(() => {
		if (!selectedEcosystem.value) return null;

		return {
			ecosystem: selectedEcosystem.value,
			libraries: Array.from(selectedLibraries.value),
		};
	});

	const handleGenerate = () => {
		const config = generateTemplateConfig();
		if (config) {
			const generated = generateTemplate(config);
			pageStore.setGeneratedTemplate(generated);
			addToHistory(config);
			pageStore.setShowPreview(true);
		}
	};

	const handleLoadConfig = (config: TemplateConfig) => {
		selectedEcosystem.value = config.ecosystem;
		selectedLibraries.value = new Set(config.libraries);
	};

	const handleAddToCompare = () => {
		const config = currentConfig.value;
		if (config) {
			const added = pageStore.addToComparison(config);
			if (added) {
				pageStore.setActiveTab("comparison");
			}
		}
	};

	const handleDownload = async () => {
		const config = currentConfig.value;
		if (!config) return;

		try {
			const response = await $fetch("/api/template.download", {
				method: "POST",
				body: config,
			});

			const blob = new Blob([response as ArrayBuffer], { type: "application/zip" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `template-${config.ecosystem}.zip`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to download template:", error);
		}
	};

	const tabs = [
		{ id: "build" as const, label: "Build", icon: "mdi:hammer" },
		{ id: "presets" as const, label: "Presets", icon: "mdi:rocket" },
		{ id: "history" as const, label: "History", icon: "mdi:history" },
		{ id: "saved" as const, label: "Saved", icon: "mdi:content-save" },
		{ id: "comparison" as const, label: "Compare", icon: "mdi:compare" },
		{ id: "stats" as const, label: "Stats", icon: "mdi:chart-bar" },
	];

	return {
		steps,
		currentConfig,
		tabs,
		handleGenerate,
		handleLoadConfig,
		handleAddToCompare,
		handleDownload,
	};
}
