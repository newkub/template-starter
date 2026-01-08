<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
	layout: "dashboard",
});

const activeTab = ref("general");
const isLoading = ref(false);

// ควรรับค่าจาก API หรือ composable แทนการ hardcode
const settings = ref({
	general: {
		siteTitle: "",
		timezone: "Asia/Bangkok",
		language: "en",
	},
	security: {
		twoFactorAuth: false,
		loginAttempts: 5,
	},
});

const saveSettings = async () => {
	isLoading.value = true;
	try {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("Settings saved:", settings.value);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
  <div class="p-8">
    <div class="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      
      <!-- Tab Navigation -->
      <NavItems 
        :menu-items="[
          { name: 'general', path: '/dashboard/settings/general' },
          { name: 'security', path: '/dashboard/settings/security' }
        ]"
        v-model="activeTab"
      />
      
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
          <input 
            v-model="settings.general.siteTitle"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select 
            v-model="settings.general.timezone"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <input 
            v-model="settings.general.language"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
        </div>
      </div>
      
      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="space-y-4">
        <div class="flex items-center">
          <input 
            id="twoFactor"
            v-model="settings.security.twoFactorAuth"
            type="checkbox" 
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="twoFactor" class="ml-2 block text-sm text-gray-700">
            Enable Two-Factor Authentication
          </label>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Login Attempts</label>
          <input 
            v-model="settings.security.loginAttempts"
            type="number" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button 
          @click="saveSettings"
          class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="i-mdi-loading animate-spin"></span>
          <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
