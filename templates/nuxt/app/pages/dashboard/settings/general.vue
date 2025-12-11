<script setup lang="ts">
definePageMeta({
	layout: "settings",
});

const props = defineProps<{
	settings: {
		siteTitle: string;
		timezone: string;
		language: string;
	};
}>();
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">General Settings</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-2">Site Title</label>
          <input 
            v-model="settings.siteTitle" 
            type="text" 
            class="w-full p-2 border rounded"
          >
        </div>
        
        <div>
          <label class="block text-gray-700 mb-2">Timezone</label>
          <select 
            v-model="settings.timezone" 
            class="w-full p-2 border rounded"
          >
            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
