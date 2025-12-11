<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8">WordPress Hosting Dashboard</h1>
    
    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500">Total Sites</div>
        <div class="text-2xl font-bold">{{ stats.totalSites }}</div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500">Running</div>
        <div class="text-2xl font-bold text-green-500">{{ stats.runningSites }}</div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500">Storage Used</div>
        <div class="text-2xl font-bold">{{ stats.storageUsed }}</div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500">Last Alert</div>
        <div class="text-sm">{{ stats.lastAlert }}</div>
      </div>
    </div>
    
    <!-- Sites List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold">Your WordPress Sites</h2>
      </div>
      
      <div class="divide-y">
        <div 
          v-for="site in sites" 
          :key="site.id"
          class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
          :class="{
            'bg-green-50': site.status === 'running',
            'bg-gray-50': site.status === 'stopped'
          }"
        >
          <div class="flex-1">
            <div class="font-medium">{{ site.name }}</div>
            <div class="text-gray-500 text-sm">{{ site.url }}</div>
            <div v-if="site.lastBackup" class="text-xs text-gray-400 mt-1">
              Last backup: {{ site.lastBackup }}
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              class="px-4 py-2 rounded text-sm"
              :class="{
                'bg-green-500 text-white': site.status !== 'running',
                'bg-gray-200': site.status === 'running'
              }"
            >
              {{ site.status === 'running' ? 'Stop' : 'Start' }}
            </button>
            
            <button class="px-4 py-2 bg-blue-500 text-white rounded text-sm">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add New Site Button -->
    <div class="mt-6 flex justify-end">
      <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        + Add New Site
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Site = {
	id: string;
	name: string;
	url: string;
	status: "running" | "stopped";
	lastBackup?: string;
};

const sites = ref<Site[]>([
	{
		id: "1",
		name: "My Blog",
		url: "blog.example.com",
		status: "running",
		lastBackup: "2025-06-26",
	},
	{ id: "2", name: "E-Commerce", url: "shop.example.com", status: "running" },
	{
		id: "3",
		name: "Portfolio",
		url: "portfolio.example.com",
		status: "stopped",
	},
]);

const stats = ref({
	totalSites: 3,
	runningSites: 2,
	storageUsed: "45%",
	lastAlert: "No recent alerts",
});
</script>
