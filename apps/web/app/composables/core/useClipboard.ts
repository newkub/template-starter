import { ref } from "vue";

export function useClipboard() {
	const copied = ref(false);
	const error = ref<string | null>(null);

	const copyToClipboard = async (text: string): Promise<boolean> => {
		try {
			await navigator.clipboard.writeText(text);
			copied.value = true;
			error.value = null;

			setTimeout(() => {
				copied.value = false;
			}, 2000);

			return true;
		} catch {
			error.value = "Failed to copy to clipboard";
			copied.value = false;
			return false;
		}
	};

	const copyCode = async (code: string, label?: string): Promise<boolean> => {
		const success = await copyToClipboard(code);
		if (success && label) {
			console.log(`${label} copied to clipboard`);
		}
		return success;
	};

	return {
		copied,
		error,
		copyToClipboard,
		copyCode,
	};
}
