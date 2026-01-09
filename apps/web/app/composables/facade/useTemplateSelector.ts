import { computed } from "vue";
import type { Ecosystem, LibraryCategory, TemplateConfig } from "~/shared/types/template";
import { ecosystems, libraryCategories } from "~/shared/data/ecosystems";

export function useTemplateSelector() {
	const selectedEcosystem = ref<Ecosystem>("bun");
	const selectedLibraries = ref<Set<string>>(new Set());
	const activeCategory = ref<LibraryCategory>("ui");

	const currentEcosystem = computed(() =>
		ecosystems.find((e: { id: string }) => e.id === selectedEcosystem.value)
	);

	const currentLibraries = computed(() => 
		currentEcosystem.value?.libraries[activeCategory.value] || []
	);

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
		ecosystems,
		libraryCategories,
		currentEcosystem,
		currentLibraries,
		toggleLibrary,
		isSelected,
		generateTemplate,
	};
}
