import type { TemplateConfig } from "../../../shared/types/template";

export function useConfigExportImport() {
	const exportConfig = (config: TemplateConfig, filename?: string) => {
		const data = JSON.stringify(config, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename || `template-${config.ecosystem}-${Date.now()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const importConfig = async (file: File): Promise<TemplateConfig | null> => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const content = e.target?.result as string;
					const config = JSON.parse(content) as TemplateConfig;
					resolve(config);
				} catch (err) {
					console.error("Failed to parse config file:", err);
					resolve(null);
				}
			};
			reader.onerror = () => {
				console.error("Failed to read file");
				resolve(null);
			};
			reader.readAsText(file);
		});
	};

	const validateConfig = (config: any): config is TemplateConfig => {
		return (
			typeof config === "object" &&
			config !== null &&
			typeof config.ecosystem === "string" &&
			Array.isArray(config.libraries) &&
			config.libraries.every((lib: any) => typeof lib === "string")
		);
	};

	return {
		exportConfig,
		importConfig,
		validateConfig,
	};
}
