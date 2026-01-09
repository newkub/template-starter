import type { TemplateConfig } from "../../../shared/types/template";

export function useUrlShare() {
	const encodeConfig = (config: TemplateConfig): string => {
		const data = JSON.stringify(config);
		return btoa(encodeURIComponent(data));
	};

	const decodeConfig = (encoded: string): TemplateConfig | null => {
		try {
			const decoded = decodeURIComponent(atob(encoded));
			return JSON.parse(decoded) as TemplateConfig;
		} catch (err) {
			console.error("Failed to decode config:", err);
			return null;
		}
	};

	const generateShareUrl = (config: TemplateConfig, baseUrl?: string): string => {
		const encoded = encodeConfig(config);
		const base = baseUrl || typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
		return `${base}?config=${encoded}`;
	};

	const getConfigFromUrl = (): TemplateConfig | null => {
		if (typeof window === "undefined") return null;

		const params = new URLSearchParams(window.location.search);
		const encoded = params.get("config");

		if (!encoded) return null;

		return decodeConfig(encoded);
	};

	const copyShareUrl = async (config: TemplateConfig): Promise<boolean> => {
		try {
			const url = generateShareUrl(config);
			await navigator.clipboard.writeText(url);
			return true;
		} catch (err) {
			console.error("Failed to copy share URL:", err);
			return false;
		}
	};

	return {
		encodeConfig,
		decodeConfig,
		generateShareUrl,
		getConfigFromUrl,
		copyShareUrl,
	};
}
