<script setup lang="ts">
import { useThemeToggle } from "~/composables/useThemeToggle";

const { colorMode, toggleTheme } = useThemeToggle();
</script>

<template>
	<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
		<div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<Icon name="mdi:application" class="text-3xl text-blue-600 dark:text-blue-400" />
				<h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Template Generator</h1>
			</div>
			<button
				@click="toggleTheme"
				class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
				:aria-label="`Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`"
				title="Toggle theme"
			>
				<Icon 
					:name="colorMode.value === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'" 
					class="text-xl text-gray-700 dark:text-gray-300"
				/>
			</button>
		</div>
	</header>
</template>
