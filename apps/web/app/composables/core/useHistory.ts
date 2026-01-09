import { ref, computed } from "vue";
import type { TemplateHistory, TemplateConfig } from "../../../shared/types/template";

const STORAGE_KEY = "template-history";
const MAX_HISTORY = 20;

export function useHistory() {
	const history = ref<TemplateHistory[]>([]);
	const loaded = ref(false);

	const loadHistory = () => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				history.value = JSON.parse(stored);
			}
		} catch (err) {
			console.error("Failed to load history:", err);
		} finally {
			loaded.value = true;
		}
	};

	const addToHistory = (config: TemplateConfig): TemplateHistory => {
		const entry: TemplateHistory = {
			id: crypto.randomUUID(),
			config,
			createdAt: new Date().toISOString(),
		};

		history.value.unshift(entry);

		if (history.value.length > MAX_HISTORY) {
			history.value = history.value.slice(0, MAX_HISTORY);
		}

		persistHistory();

		return entry;
	};

	const removeFromHistory = (id: string): boolean => {
		const index = history.value.findIndex((h) => h.id === id);
		if (index >= 0) {
			history.value.splice(index, 1);
			persistHistory();
			return true;
		}
		return false;
	};

	const clearHistory = (): void => {
		history.value = [];
		persistHistory();
	};

	const loadFromHistory = (id: string): TemplateConfig | null => {
		const entry = history.value.find((h) => h.id === id);
		return entry ? entry.config : null;
	};

	const persistHistory = () => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
		} catch (err) {
			console.error("Failed to persist history:", err);
		}
	};

	const historyCount = computed(() => history.value.length);

	const recentHistory = computed(() => history.value.slice(0, 5));

	if (!loaded.value) {
		loadHistory();
	}

	return {
		history,
		loaded,
		historyCount,
		recentHistory,
		loadHistory,
		addToHistory,
		removeFromHistory,
		clearHistory,
		loadFromHistory,
	};
}
