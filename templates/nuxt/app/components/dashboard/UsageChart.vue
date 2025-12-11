<script setup lang="ts">
defineProps<{
	data: {
		bandwidth: { used: number; total: number };
		storage: { used: number; total: number };
	};
}>();
</script>

<template>
  <div class="h-full w-full flex items-center justify-center bg-gray-50 rounded">
    <div class="text-center">
      <p class="text-gray-500 mb-2">Usage chart component</p>
      <p class="text-sm text-gray-400">
        Bandwidth: {{ data.bandwidth.used }} / {{ data.bandwidth.total }} GB
      </p>
      <p class="text-sm text-gray-400">
        Storage: {{ data.storage.used }} / {{ data.storage.total }} GB
      </p>
    </div>
  </div>
</template>
