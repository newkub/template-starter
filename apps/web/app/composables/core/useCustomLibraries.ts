import { ref, computed } from "vue";
import type { CustomLibrary, LibraryCategory } from "../../../shared/types/template";

const STORAGE_KEY = "template-custom-libraries";

export function useCustomLibraries() {
	const customLibraries = ref<CustomLibrary[]>([]);
	const loaded = ref(false);

	const loadLibraries = () => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				customLibraries.value = JSON.parse(stored);
			}
		} catch (err) {
			console.error("Failed to load custom libraries:", err);
		} finally {
			loaded.value = true;
		}
	};

	const addLibrary = (library: Omit<CustomLibrary, "id">): CustomLibrary => {
		const newLibrary: CustomLibrary = {
			id: crypto.randomUUID(),
			name: library.name || "",
			description: library.description || "",
			icon: library.icon || "mdi:package-variant",
			category: library.category || "ui",
			docsUrl: library.docsUrl?.trim(),
			githubUrl: library.githubUrl?.trim(),
		};

		customLibraries.value.push(newLibrary);
		persistLibraries();

		return newLibrary;
	};

	const updateLibrary = (id: string, updates: Partial<CustomLibrary>): CustomLibrary | null => {
		const index = customLibraries.value.findIndex((lib) => lib.id === id);
		if (index >= 0) {
			Object.assign(customLibraries.value[index]!, updates);
			persistLibraries();
			return customLibraries.value[index] || null;
		}
		return null;
	};

	const deleteLibrary = (id: string): boolean => {
		const index = customLibraries.value.findIndex((lib) => lib.id === id);
		if (index >= 0) {
			customLibraries.value.splice(index, 1);
			persistLibraries();
			return true;
		}
		return false;
	};

	const getLibrariesByCategory = (category: LibraryCategory): CustomLibrary[] => {
		return customLibraries.value.filter((lib) => lib.category === category);
	};

	const persistLibraries = () => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(customLibraries.value));
		} catch (err) {
			console.error("Failed to persist custom libraries:", err);
		}
	};

	const libraryCount = computed(() => customLibraries.value.length);

	if (!loaded.value) {
		loadLibraries();
	}

	return {
		customLibraries,
		loaded,
		libraryCount,
		loadLibraries,
		addLibrary,
		updateLibrary,
		deleteLibrary,
		getLibrariesByCategory,
	};
}
