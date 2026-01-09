import { ref, computed } from "vue";
import type { SavedConfig, TemplateConfig } from "../../../shared/types/template";

const STORAGE_KEY = "template-saved-configs";

export function useSavedConfigs() {
	const savedConfigs = ref<SavedConfig[]>([]);
	const loaded = ref(false);

	const loadConfigs = () => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				savedConfigs.value = JSON.parse(stored);
			}
		} catch (err) {
			console.error("Failed to load saved configs:", err);
		} finally {
			loaded.value = true;
		}
	};

	const saveConfig = (name: string, config: TemplateConfig): SavedConfig => {
		const existingIndex = savedConfigs.value.findIndex((c) => c.name === name);

		const savedConfig: SavedConfig = {
			id: existingIndex >= 0 ? (savedConfigs.value[existingIndex]?.id || crypto.randomUUID()) : crypto.randomUUID(),
			name,
			config,
			createdAt: existingIndex >= 0 ? (savedConfigs.value[existingIndex]?.createdAt || new Date().toISOString()) : new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		if (existingIndex >= 0) {
			savedConfigs.value[existingIndex] = savedConfig;
		} else {
			savedConfigs.value.push(savedConfig);
		}

		persistConfigs();

		return savedConfig;
	};

	const deleteConfig = (id: string): boolean => {
		const index = savedConfigs.value.findIndex((c) => c.id === id);
		if (index >= 0) {
			savedConfigs.value.splice(index, 1);
			persistConfigs();
			return true;
		}
		return false;
	};

	const loadConfig = (id: string): TemplateConfig | null => {
		const config = savedConfigs.value.find((c) => c.id === id);
		return config ? config.config : null;
	};

	const updateConfig = (id: string, name?: string, config?: TemplateConfig): SavedConfig | null => {
		const index = savedConfigs.value.findIndex((c) => c.id === id);
		if (index >= 0) {
			if (name) savedConfigs.value[index]!.name = name;
			if (config) savedConfigs.value[index]!.config = config;
			savedConfigs.value[index]!.updatedAt = new Date().toISOString();
			persistConfigs();
			return savedConfigs.value[index] || null;
		}
		return null;
	};

	const persistConfigs = () => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(savedConfigs.value));
		} catch (err) {
			console.error("Failed to persist saved configs:", err);
		}
	};

	const configCount = computed(() => savedConfigs.value.length);

	if (!loaded.value) {
		loadConfigs();
	}

	return {
		savedConfigs,
		loaded,
		configCount,
		loadConfigs,
		saveConfig,
		deleteConfig,
		loadConfig,
		updateConfig,
	};
}
