import { ref, computed } from "vue";

export type LoadingState = "idle" | "loading" | "success" | "error";

const isLoading = ref(false);
const loadingState = ref<LoadingState>("idle");
const loadingMessage = ref("");
const loadingProgress = ref(0);

const startLoading = (message?: string) => {
	isLoading.value = true;
	loadingState.value = "loading";
	loadingMessage.value = message || "Loading...";
	loadingProgress.value = 0;
};

const updateProgress = (progress: number, message?: string) => {
	loadingProgress.value = Math.min(Math.max(progress, 0), 100);
	if (message) {
		loadingMessage.value = message;
	}
};

const stopLoading = (state: "success" | "error" = "success") => {
	loadingState.value = state;
	isLoading.value = false;
	loadingProgress.value = 100;
};

const resetLoading = () => {
	isLoading.value = false;
	loadingState.value = "idle";
	loadingMessage.value = "";
	loadingProgress.value = 0;
};

const isIdle = computed(() => loadingState.value === "idle");
const isSuccess = computed(() => loadingState.value === "success");
const isError = computed(() => loadingState.value === "error");

export function useLoading() {
	return {
		isLoading: computed(() => isLoading.value),
		loadingState: computed(() => loadingState.value),
		loadingMessage: computed(() => loadingMessage.value),
		loadingProgress: computed(() => loadingProgress.value),
		isIdle,
		isSuccess,
		isError,
		startLoading,
		updateProgress,
		stopLoading,
		resetLoading,
	};
}
