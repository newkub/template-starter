<script setup lang="ts">
import type { Library } from "~/shared/types/template";

interface Props {
	library: Library | null;
	open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

const closeModal = () => {
	emit("close");
};

const handleBackdropClick = (event: MouseEvent) => {
	if (event.target === event.currentTarget) {
		closeModal();
	}
};
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="open && library"
				class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
				@click="handleBackdropClick"
			>
				<div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
					<div class="p-6">
						<div class="flex items-start justify-between mb-4">
							<div class="flex items-center gap-3">
								<div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
									<Icon :name="library.icon" class="text-2xl text-blue-600 dark:text-blue-400" />
								</div>
								<div>
									<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ library.name }}</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">{{ library.description }}</p>
								</div>
							</div>
							<button
								@click="closeModal"
								class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
							>
								<Icon name="mdi:close" class="text-xl" />
							</button>
						</div>

						<div class="space-y-4">
							<div v-if="library.docsUrl || library.githubUrl" class="flex gap-2">
								<a
									v-if="library.docsUrl"
									:href="library.docsUrl"
									target="_blank"
									rel="noopener noreferrer"
									class="flex-1 px-4 py-2 text-sm text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
								>
									<Icon name="mdi:book-open-variant" class="text-base" />
									Documentation
								</a>
								<a
									v-if="library.githubUrl"
									:href="library.githubUrl"
									target="_blank"
									rel="noopener noreferrer"
									class="flex-1 px-4 py-2 text-sm text-center bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
								>
									<Icon name="mdi:github" class="text-base" />
									GitHub
								</a>
							</div>

							<div v-if="library.popularity" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Popularity</span>
									<div class="flex items-center gap-2">
										<Icon name="mdi:star" class="text-yellow-500" />
										<span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ library.popularity }}</span>
									</div>
								</div>
							</div>

							<div v-if="library.dependencies && library.dependencies.length > 0" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
								<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dependencies</h4>
								<div class="flex flex-wrap gap-2">
									<span
										v-for="dep in library.dependencies"
										:key="dep"
										class="px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
									>
										{{ dep }}
									</span>
								</div>
							</div>

							<div v-if="library.examples && library.examples.length > 0" class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
								<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Examples</h4>
								<ul class="space-y-1">
									<li
										v-for="(example, index) in library.examples"
										:key="index"
										class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
									>
										<Icon name="mdi:chevron-right" class="text-base mt-0.5" />
										{{ example }}
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
	transform: scale(0.95);
	opacity: 0;
}
</style>
