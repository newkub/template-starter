import type { TemplateConfig, TemplateVersion, VersionHistory } from "#shared/types/template";

export const useTemplateVersioning = () => {
	const STORAGE_KEY = "template-versions";

	const getVersionHistory = (templateId: string): VersionHistory | null => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const allHistories = JSON.parse(data) as Record<string, VersionHistory>;
				return allHistories[templateId] || null;
			}
		}
		return null;
	};

	const saveVersion = (
		templateId: string,
		config: TemplateConfig,
		changes: string[],
		createdBy?: string,
	): TemplateVersion => {
		const history = getVersionHistory(templateId) || {
			templateId,
			versions: [],
			currentVersion: "0.0.0",
		};

		const lastVersion = history.versions[history.versions.length - 1];
		const newVersionNumber = incrementVersion(lastVersion?.version || "0.0.0");

		const newVersion: TemplateVersion = {
			id: `${templateId}-${Date.now()}`,
			templateId,
			version: newVersionNumber,
			config,
			changes,
			createdAt: new Date().toISOString(),
			createdBy,
		};

		history.versions.push(newVersion);
		history.currentVersion = newVersionNumber;

		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const allHistories = data ? JSON.parse(data) : {};
			allHistories[templateId] = history;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
		}

		return newVersion;
	};

	const rollbackToVersion = (
		templateId: string,
		version: string,
	): TemplateConfig | null => {
		const history = getVersionHistory(templateId);
		if (!history) return null;

		const targetVersion = history.versions.find((v) => v.version === version);
		if (!targetVersion) return null;

		const rollbackVersion = saveVersion(
			templateId,
			targetVersion.config,
			[`Rollback to version ${version}`],
		);

		history.currentVersion = rollbackVersion.version;

		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const allHistories = data ? JSON.parse(data) : {};
			allHistories[templateId] = history;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
		}

		return targetVersion.config;
	};

	const getVersion = (
		templateId: string,
		version: string,
	): TemplateVersion | null => {
		const history = getVersionHistory(templateId);
		if (!history) return null;

		return history.versions.find((v) => v.version === version) || null;
	};

	const getCurrentVersion = (templateId: string): TemplateVersion | null => {
		const history = getVersionHistory(templateId);
		if (!history) return null;

		return history.versions.find((v) => v.version === history.currentVersion) || null;
	};

	const deleteVersion = (templateId: string, version: string): boolean => {
		const history = getVersionHistory(templateId);
		if (!history) return false;

		const versionIndex = history.versions.findIndex((v) => v.version === version);
		if (versionIndex === -1) return false;

		if (history.versions[versionIndex].version === history.currentVersion) {
			return false;
		}

		history.versions.splice(versionIndex, 1);

		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const allHistories = data ? JSON.parse(data) : {};
			allHistories[templateId] = history;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
		}

		return true;
	};

	const clearHistory = (templateId: string): void => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const allHistories = JSON.parse(data);
				delete allHistories[templateId];
				localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistories));
			}
		}
	};

	const getAllHistories = (): Record<string, VersionHistory> => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : {};
		}
		return {};
	};

	return {
		getVersionHistory,
		saveVersion,
		rollbackToVersion,
		getVersion,
		getCurrentVersion,
		deleteVersion,
		clearHistory,
		getAllHistories,
	};
};

function incrementVersion(version: string): string {
	const parts = version.split(".").map((p) => Number.parseInt(p, 10));

	parts[2]++;

	if (parts[2] > 99) {
		parts[2] = 0;
		parts[1]++;
	}

	if (parts[1] > 99) {
		parts[1] = 0;
		parts[0]++;
	}

	return parts.join(".");
}
