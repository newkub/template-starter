import type { ExportConfig, ExportResult, TemplateConfig, TemplateFile } from "#shared/types/template";
import { useTemplateGenerator } from "./useTemplateGenerator";

export const useExportTemplate = () => {
	const STORAGE_KEY = "export-results";

	const exportToGitHub = async (
		config: TemplateConfig,
		exportConfig: ExportConfig,
	): Promise<ExportResult> => {
		const exportId = `export-${Date.now()}`;

		try {
			const { generateTemplate } = useTemplateGenerator();
			const template = generateTemplate(config);

			const repoUrl = await mockGitHubExport(template, exportConfig);

			const result: ExportResult = {
				id: exportId,
				format: "github",
				url: repoUrl,
				status: "success",
				exportedAt: new Date().toISOString(),
			};

			saveExportResult(exportId, result);
			return result;
		} catch (error) {
			const result: ExportResult = {
				id: exportId,
				format: "github",
				status: "failed",
				error: error instanceof Error ? error.message : "Export failed",
				exportedAt: new Date().toISOString(),
			};

			saveExportResult(exportId, result);
			return result;
		}
	};

	const exportToGitLab = async (
		config: TemplateConfig,
		exportConfig: ExportConfig,
	): Promise<ExportResult> => {
		const exportId = `export-${Date.now()}`;

		try {
			const { generateTemplate } = useTemplateGenerator();
			const template = generateTemplate(config);

			const repoUrl = await mockGitLabExport(template, exportConfig);

			const result: ExportResult = {
				id: exportId,
				format: "gitlab",
				url: repoUrl,
				status: "success",
				exportedAt: new Date().toISOString(),
			};

			saveExportResult(exportId, result);
			return result;
		} catch (error) {
			const result: ExportResult = {
				id: exportId,
				format: "gitlab",
				status: "failed",
				error: error instanceof Error ? error.message : "Export failed",
				exportedAt: new Date().toISOString(),
			};

			saveExportResult(exportId, result);
			return result;
		}
	};

	const exportToFolder = async (
		config: TemplateConfig,
		exportConfig: ExportConfig,
	): Promise<ExportResult> => {
		const exportId = `export-${Date.now()}`;

		try {
			const { generateTemplate } = useTemplateGenerator();
			const template = generateTemplate(config);

			const folderPath = await mockFolderExport(template, exportConfig);

			const result: ExportResult = {
				id: exportId,
				format: "folder",
				path: folderPath,
				status: "success",
				exportedAt: new Date().toISOString(),
			};

			saveExportResult(exportId, result);
			return result;
		} catch (error) {
			const result: ExportResult = {
				id: exportId,
				format: "folder",
				status: "failed",
				error: error instanceof Error ? error.message : "Export failed",
				exportedAt: new Date().toISOString(),
			};

			saveExportResult(exportId, result);
			return result;
		}
	};

	const exportTemplate = async (
		config: TemplateConfig,
		exportConfig: ExportConfig,
	): Promise<ExportResult> => {
		switch (exportConfig.format) {
			case "github":
				return exportToGitHub(config, exportConfig);
			case "gitlab":
				return exportToGitLab(config, exportConfig);
			case "folder":
				return exportToFolder(config, exportConfig);
			default:
				throw new Error(`Unsupported format: ${exportConfig.format}`);
		}
	};

	const getExportResults = (): ExportResult[] => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : [];
		}
		return [];
	};

	const getExportResultById = (id: string): ExportResult | null => {
		const results = getExportResults();
		return results.find((r) => r.id === id) || null;
	};

	const clearExportHistory = (): void => {
		if (import.meta.client) {
			localStorage.removeItem(STORAGE_KEY);
		}
	};

	const downloadAsZip = (config: TemplateConfig): void => {
		const { generateTemplate } = useTemplateGenerator();
		const template = generateTemplate(config);

		const zipContent = generateZipContent(template.files);

		const blob = new Blob([zipContent], { type: "application/zip" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${config.ecosystem}-template.zip`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const downloadAsTarball = (config: TemplateConfig): void => {
		const { generateTemplate } = useTemplateGenerator();
		const template = generateTemplate(config);

		const tarballContent = generateTarballContent(template.files);

		const blob = new Blob([tarballContent], { type: "application/x-tar" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${config.ecosystem}-template.tar.gz`;
		a.click();
		URL.revokeObjectURL(url);
	};

	function saveExportResult(exportId: string, result: ExportResult): void {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const results = data ? JSON.parse(data) : [];
			results.push(result);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
		}
	}

	async function mockGitHubExport(
		template: { files: TemplateFile[] },
		config: ExportConfig,
	): Promise<string> {
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const repoName = config.repoName || `${template.files[0]?.path.split("/")[0] || "template"}`;
		return `https://github.com/your-username/${repoName}`;
	}

	async function mockGitLabExport(
		template: { files: TemplateFile[] },
		config: ExportConfig,
	): Promise<string> {
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const repoName = config.repoName || `${template.files[0]?.path.split("/")[0] || "template"}`;
		return `https://gitlab.com/your-username/${repoName}`;
	}

	async function mockFolderExport(
		template: { files: TemplateFile[] },
		_config: ExportConfig,
	): Promise<string> {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return `/Downloads/${template.files[0]?.path.split("/")[0] || "template"}`;
	}

	function generateZipContent(files: TemplateFile[]): string {
		return JSON.stringify(files, null, 2);
	}

	function generateTarballContent(files: TemplateFile[]): string {
		return JSON.stringify(files, null, 2);
	}

	return {
		exportTemplate,
		exportToGitHub,
		exportToGitLab,
		exportToFolder,
		getExportResults,
		getExportResultById,
		clearExportHistory,
		downloadAsZip,
		downloadAsTarball,
	};
};
