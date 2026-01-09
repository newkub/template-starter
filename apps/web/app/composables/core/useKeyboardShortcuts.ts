import { onMounted, onUnmounted } from "vue";

export interface KeyboardShortcut {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	meta?: boolean;
	description: string;
	action: () => void;
}

const shortcuts = ref<KeyboardShortcut[]>([]);

const registerShortcut = (shortcut: KeyboardShortcut) => {
	shortcuts.value.push(shortcut);
};

const unregisterShortcut = (shortcut: KeyboardShortcut) => {
	const index = shortcuts.value.indexOf(shortcut);
	if (index > -1) {
		shortcuts.value.splice(index, 1);
	}
};

const handleKeyDown = (event: KeyboardEvent) => {
	for (const shortcut of shortcuts.value) {
		const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
		const ctrlMatch = (shortcut.ctrl ?? false) === event.ctrlKey;
		const shiftMatch = (shortcut.shift ?? false) === event.shiftKey;
		const altMatch = (shortcut.alt ?? false) === event.altKey;
		const metaMatch = (shortcut.meta ?? false) === event.metaKey;

		if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
			event.preventDefault();
			shortcut.action();
			break;
		}
	}
};

export function useKeyboardShortcuts() {
	onMounted(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeyDown);
	});

	return {
		shortcuts,
		registerShortcut,
		unregisterShortcut,
	};
}
