<script setup lang="ts">
import { ref } from "vue";
import type { CustomLibrary, LibraryCategory } from "~/shared/types/template";
import { useCustomLibraries } from "~/composables/core/useCustomLibraries";
import { libraryCategories } from "~/shared/data/ecosystems";

const { customLibraries, addLibrary, deleteLibrary } = useCustomLibraries();

const showAddDialog = ref(false);
const newLibrary = ref<Partial<CustomLibrary>>({
	name: "",
	description: "",
	icon: "mdi:package-variant",
	category: "ui",
	docsUrl: "",
	githubUrl: "",
});

const openAddDialog = () => {
	showAddDialog.value = true;
	newLibrary.value = {
		name: "",
		description: "",
		icon: "mdi:package-variant",
		category: "ui",
		docsUrl: "",
		githubUrl: "",
	};
};

const closeAddDialog = () => {
	showAddDialog.value = false;
};

const handleAdd = () => {
	if (!newLibrary.value.name?.trim() || !newLibrary.value.description?.trim()) return;

	addLibrary({
		name: newLibrary.value.name.trim(),
		description: newLibrary.value.description.trim(),
		icon: newLibrary.value.icon || "mdi:package-variant",
		category: newLibrary.value.category || "ui",
		docsUrl: newLibrary.value.docsUrl?.trim(),
		githubUrl: newLibrary.value.githubUrl?.trim(),
	});

	closeAddDialog();
};

const handleDelete = (id: string) => {
	if (confirm("Are you sure you want to delete this custom library?")) {
		deleteLibrary(id);
	}
};

const getCategoryName = (categoryId: LibraryCategory) => {
	const category = libraryCategories.find((c: { id: LibraryCategory }) => c.id === categoryId);
	return category?.name || categoryId;
};
</script>

<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-semibold text-gray-900 dark:text-gray-100">Custom Libraries</h3>
			<button
				@click="openAddDialog"
				class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
			>
				<Icon name="mdi:plus" class="text-base" />
				Add Library
			</button>
		</div>

		<div v-if="customLibraries.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
			<Icon name="mdi:package-variant-closed" class="text-4xl mb-2" />
			<p class="text-sm">No custom libraries yet</p>
		</div>

		<div v-else class="space-y-2">
			<div
				v-for="library in customLibraries"
				:key="library.id"
				class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
			>
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-3">
						<div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
							<Icon :name="library.icon" class="text-xl text-purple-600 dark:text-purple-400" />
						</div>
						<div>
							<h4 class="font-medium text-gray-900 dark:text-gray-100">{{ library.name }}</h4>
							<p class="text-xs text-gray-500 dark:text-gray-400">{{ getCategoryName(library.category) }}</p>
							<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ library.description }}</p>
						</div>
					</div>
					<button
						@click="handleDelete(library.id)"
						class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
						title="Delete"
					>
						<Icon name="mdi:delete" class="text-lg" />
					</button>
				</div>
			</div>
		</div>
	</div>

	<div v-if="showAddDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Add Custom Library</h3>

			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
					<input
						v-model="newLibrary.name"
						type="text"
						placeholder="Library name"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
					<textarea
						v-model="newLibrary.description"
						placeholder="Brief description"
						rows="2"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
					<select
						v-model="newLibrary.category"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option v-for="cat in libraryCategories" :key="cat.id" :value="cat.id">
							{{ cat.name }}
						</option>
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (MDI)</label>
					<input
						v-model="newLibrary.icon"
						type="text"
						placeholder="mdi:icon-name"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Documentation URL (optional)</label>
					<input
						v-model="newLibrary.docsUrl"
						type="url"
						placeholder="https://..."
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL (optional)</label>
					<input
						v-model="newLibrary.githubUrl"
						type="url"
						placeholder="https://github.com/..."
						class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div class="flex gap-3 justify-end mt-6">
				<button
					@click="closeAddDialog"
					class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				>
					Cancel
				</button>
				<button
					@click="handleAdd"
					class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Add Library
				</button>
			</div>
		</div>
	</div>
</template>
