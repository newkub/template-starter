<script setup lang="ts">
import { useLoading } from "~/composables/core/useLoading";

const { isLoading, loadingState, loadingMessage, loadingProgress, isIdle, isSuccess, isError } = useLoading();
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-200"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity duration-200"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="isLoading"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				role="dialog"
				aria-modal="true"
				aria-labelledby="loading-title"
			>
				<div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
					<div class="flex flex-col items-center gap-4">
						<div class="relative">
							<div class="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
							<div
								class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
							></div>
							<Icon
								v-if="isSuccess"
								name="mdi:check"
								class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-green-600 dark:text-green-400"
							/>
							<Icon
								v-if="isError"
								name="mdi:close"
								class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-red-600 dark:text-red-400"
							/>
						</div>

						<div class="text-center w-full">
							<h3 id="loading-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
								{{ loadingMessage }}
							</h3>
							<p v-if="loadingProgress > 0 && loadingProgress < 100" class="text-sm text-gray-500 dark:text-gray-400">
								{{ loadingProgress }}%
							</p>
						</div>

						<div v-if="loadingProgress > 0 && loadingProgress < 100" class="w-full">
							<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
								<div
									class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out"
									:style="{ width: `${loadingProgress}%` }"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
