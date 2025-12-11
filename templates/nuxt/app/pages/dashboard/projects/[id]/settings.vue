<script setup lang="ts">
// Settings page content
const activeTab = ref("general");
const settings = reactive({
	siteTitle: "",
	timezone: "Asia/Bangkok",
	maintenanceMode: false,
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Settings</h2>
    
    <div class="flex border-b mb-6">
      <button 
        v-for="tab in ['general', 'security', 'advanced']"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2"
        :class="{ 'border-b-2 border-blue-500': activeTab === tab }"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <div v-if="activeTab === 'general'">
      <div class="space-y-4">
        <div>
          <label class="block mb-1">Site Title</label>
          <input 
            v-model="settings.siteTitle" 
            type="text" 
            class="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label class="block mb-1">Timezone</label>
          <select v-model="settings.timezone" class="w-full p-2 border rounded">
            <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'security'">
      <div class="space-y-4">
        <div class="flex items-center">
          <input 
            id="maintenance" 
            v-model="settings.maintenanceMode" 
            type="checkbox" 
            class="mr-2"
          />
          <label for="maintenance">Maintenance Mode</label>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Save Settings
      </button>
    </div>
  </div>
</template>
