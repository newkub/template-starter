export function useThemeToggle() {
	const colorMode = useColorMode();

	const toggleTheme = () => {
		colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
	};

	return {
		colorMode,
		toggleTheme,
	};
}
