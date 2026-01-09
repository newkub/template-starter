<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
	text: string;
	position?: "top" | "bottom" | "left" | "right";
	delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
	position: "top",
	delay: 200,
});

const visible = ref(false);
const timeout = ref<number | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);

const show = () => {
	if (timeout.value) {
		clearTimeout(timeout.value);
	}
	timeout.value = window.setTimeout(() => {
		visible.value = true;
	}, props.delay);
};

const hide = () => {
	if (timeout.value) {
		clearTimeout(timeout.value);
	}
	visible.value = false;
};

const getPositionClasses = computed(() => {
	switch (props.position) {
		case "top":
			return "bottom-full left-1/2 -translate-x-1/2 mb-2";
		case "bottom":
			return "top-full left-1/2 -translate-x-1/2 mt-2";
		case "left":
			return "right-full top-1/2 -translate-y-1/2 mr-2";
		case "right":
			return "left-full top-1/2 -translate-y-1/2 ml-2";
		default:
			return "bottom-full left-1/2 -translate-x-1/2 mb-2";
	}
});

const getArrowClasses = computed(() => {
	switch (props.position) {
		case "top":
			return "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100";
		case "bottom":
			return "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100";
		case "left":
			return "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100";
		case "right":
			return "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100";
		default:
			return "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100";
	}
});

onUnmounted(() => {
	if (timeout.value) {
		clearTimeout(timeout.value);
	}
});
</script>

<template>
	<div class="relative inline-block" @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide">
		<slot />

		<Transition
			enter-active-class="transition-all duration-200 ease-out"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="visible"
				ref="tooltipRef"
				:class="`absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-100 rounded-lg shadow-lg whitespace-nowrap ${getPositionClasses}`"
				role="tooltip"
			>
				{{ text }}
				<div
					:class="`absolute w-2 h-2 border-4 border-transparent ${getArrowClasses}`"
				></div>
			</div>
		</Transition>
	</div>
</template>
