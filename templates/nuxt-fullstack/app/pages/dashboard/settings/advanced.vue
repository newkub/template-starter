<script setup lang="ts">
definePageMeta({
	layout: "settings",
});

const props = defineProps<{
	settings?: {
		maintenanceMode: boolean;
		autoUpdates: boolean;
		debugMode: boolean;
	};
}>();

const localSettings = ref({
	maintenanceMode: props.settings?.maintenanceMode ?? false,
	autoUpdates: props.settings?.autoUpdates ?? false,
	debugMode: props.settings?.debugMode ?? false,
});
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Advanced Settings</h2>
      
      <div class="space-y-4">
        <!-- Add advanced settings controls here -->
        <div class="flex items-center justify-between">
          <div>
            <label class="block text-gray-700">Maintenance Mode</label>
            <p class="text-sm text-gray-500">Enable maintenance mode</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="localSettings.maintenanceMode" 
              type="checkbox" 
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
