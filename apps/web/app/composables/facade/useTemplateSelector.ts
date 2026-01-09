import { computed, ref } from "vue";
import type { Ecosystem, LibraryCategory, TemplateConfig, LibraryCategoryConfig } from "~~/shared/types/template";
import { ecosystems, libraryCategories, packageManagers } from "~~/shared/data/ecosystems";

export function useTemplateSelector() {
	const selectedEcosystem = ref<Ecosystem>("bun");
	const selectedLibraries = ref<Set<string>>(new Set());
	const activeCategory = ref<LibraryCategory>("ui");
	const selectedPackageManager = ref("bun");

	const currentEcosystem = computed(() =>
		ecosystems.find((e: { id: string }) => e.id === selectedEcosystem.value)
	);

	const currentLibraries = computed(() =>
		currentEcosystem.value?.libraries[activeCategory.value] || []
	);

	const getCategoryName = computed(() => {
		const category = libraryCategories.find((c: LibraryCategoryConfig) => c.id === activeCategory.value);
		return category?.name || "";
	});

	const toggleLibrary = (libraryId: string) => {
		if (selectedLibraries.value.has(libraryId)) {
			selectedLibraries.value.delete(libraryId);
		} else {
			selectedLibraries.value.add(libraryId);
		}
	};

	const isSelected = (libraryId: string) => selectedLibraries.value.has(libraryId);

	const generateTemplate = (): TemplateConfig | null => {
		const ecosystem = currentEcosystem.value;
		if (!ecosystem) return null;

		return {
			ecosystem: ecosystem.id,
			libraries: Array.from(selectedLibraries.value),
		};
	};

	return {
		selectedEcosystem,
		selectedLibraries,
		activeCategory,
		selectedPackageManager,
		ecosystems,
		libraryCategories,
		packageManagers,
		currentEcosystem,
		currentLibraries,
		getCategoryName,
		toggleLibrary,
		isSelected,
		generateTemplate,
	};
}
