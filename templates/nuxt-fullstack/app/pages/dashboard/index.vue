
<script setup lang="ts">
definePageMeta({
	layout: "dashboard",
});

const stats = [
	{
		title: "Total Sites",
		value: "24",
		icon: "i-heroicons-home",
		trend: "up",
		change: "12%",
	},
	{
		title: "Active Sites",
		value: "18",
		icon: "i-heroicons-bolt",
		trend: "up",
		change: "5%",
	},
	{
		title: "Inactive Sites",
		value: "6",
		icon: "i-heroicons-pause",
		trend: "down",
		change: "2%",
	},
	{
		title: "Storage Used",
		value: "45%",
		icon: "i-heroicons-server",
		trend: "up",
		change: "10%",
	},
];
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <div :class="stat.icon" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ stat.title }}
            </span>
          </div>
          <div 
            v-if="stat.trend"
            class="flex items-center text-xs"
            :class="{
              'text-green-600 dark:text-green-400': stat.trend === 'up',
              'text-red-600 dark:text-red-400': stat.trend === 'down'
            }"
          >
            <div 
              :class="stat.trend === 'up' ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
              class="w-4 h-4 mr-1" 
            />
            {{ stat.change }}
          </div>
        </div>
        <p class="text-2xl font-bold mt-3">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-start space-x-3">
          <div class="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <div class="i-heroicons-user-circle w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">Site updated successfully</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Traffic Overview</h3>
        <div class="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
          <p class="text-gray-400">Traffic Chart Placeholder</p>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Recent Notifications</h3>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-start">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
              <div class="i-heroicons-bell w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="font-medium">New notification</p>
              <p class="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div class="i-mdi-plus-circle-outline text-blue-600 dark:text-blue-400 text-3xl mb-2" />
          <span>Add Site</span>
        </button>
        <button class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div class="i-mdi-cloud-upload-outline text-blue-600 dark:text-blue-400 text-3xl mb-2" />
          <span>Backup</span>
        </button>
        <button class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div class="i-mdi-cog-outline text-blue-600 dark:text-blue-400 text-3xl mb-2" />
          <span>Settings</span>
        </button>
        <button class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div class="i-mdi-calendar-clock-outline text-blue-600 dark:text-blue-400 text-3xl mb-2" />
          <span>Schedule</span>
        </button>
      </div>
    </div>
  </div>
</template>
