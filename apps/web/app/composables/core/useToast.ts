import { ref, computed } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
	actions?: Array<{
		label: string;
		onClick: () => void;
	}>;
}

const toasts = ref<Toast[]>([]);

const addToast = (toast: Omit<Toast, "id">) => {
	const id = crypto.randomUUID();
	const newToast: Toast = {
		id,
		duration: 5000,
		...toast,
	};

	toasts.value.push(newToast);

	if (newToast.duration && newToast.duration > 0) {
		setTimeout(() => {
			removeToast(id);
		}, newToast.duration);
	}

	return id;
};

const removeToast = (id: string) => {
	const index = toasts.value.findIndex((t) => t.id === id);
	if (index > -1) {
		toasts.value.splice(index, 1);
	}
};

const clearAll = () => {
	toasts.value = [];
};

const success = (title: string, message?: string, duration?: number) => {
	return addToast({ type: "success", title, message, duration });
};

const error = (title: string, message?: string, duration?: number) => {
	return addToast({ type: "error", title, message, duration: duration ?? 7000 });
};

const warning = (title: string, message?: string) => {
	return addToast({ type: "warning", title, message });
};

const info = (title: string, message?: string) => {
	return addToast({ type: "info", title, message });
};

export function useToast() {
	return {
		toasts: computed(() => toasts.value),
		addToast,
		removeToast,
		clearAll,
		success,
		error,
		warning,
		info,
	};
}
