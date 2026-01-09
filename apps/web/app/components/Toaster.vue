<script setup lang="ts">
import { TransitionGroup } from "vue";
import { useToast, type ToastType } from "~/composables/core/useToast";

const { toasts, removeToast } = useToast();

const getIcon = (type: ToastType) => {
	switch (type) {
		case "success":
			return "mdi:check-circle";
		case "error":
			return "mdi:alert-circle";
		case "warning":
			return "mdi:alert";
		case "info":
			return "mdi:information";
		default:
			return "mdi:information";
	}
};

const getBgColor = (type: ToastType) => {
	switch (type) {
		case "success":
			return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
		case "error":
			return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
		case "warning":
			return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
		case "info":
			return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
		default:
			return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
	}
};

const getIconColor = (type: ToastType) => {
	switch (type) {
		case "success":
			return "text-green-600 dark:text-green-400";
		case "error":
			return "text-red-600 dark:text-red-400";
		case "warning":
			return "text-yellow-600 dark:text-yellow-400";
		case "info":
			return "text-blue-600 dark:text-blue-400";
		default:
			return "text-gray-600 dark:text-gray-400";
	}
};
</script>

<template>
	<Teleport to="body">
		<TransitionGroup
			tag="div"
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="transform translate-x-full opacity-0"
			enter-to-class="transform translate-x-0 opacity-100"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="transform translate-x-0 opacity-100"
			leave-to-class="transform translate-x-full opacity-0"
			class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
		>
			<div
				v-for="toast in toasts"
				:key="toast.id"
				:class="`pointer-events-auto p-4 rounded-lg border-2 shadow-lg ${getBgColor(toast.type)}`"
				role="alert"
				:aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
			>
				<div class="flex items-start gap-3">
					<Icon :name="getIcon(toast.type)" :class="`text-xl mt-0.5 flex-shrink-0 ${getIconColor(toast.type)}`" />
					<div class="flex-1 min-w-0">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ toast.title }}</h4>
						<p v-if="toast.message" class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ toast.message }}</p>
						<div v-if="toast.actions && toast.actions.length > 0" class="mt-3 flex gap-2">
							<button
								v-for="(action, index) in toast.actions"
								:key="index"
								@click="action.onClick(); removeToast(toast.id)"
								class="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
							>
								{{ action.label }}
							</button>
						</div>
					</div>
					<button
						@click="removeToast(toast.id)"
						class="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
						:aria-label="`Dismiss ${toast.title}`"
					>
						<Icon name="mdi:close" class="text-lg" />
					</button>
				</div>
			</div>
		</TransitionGroup>
	</Teleport>
</template>
