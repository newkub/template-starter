<script setup lang="ts">
import { ref } from "vue";

const stats = ref([
	{ title: "Visitors", value: "1,234", change: "+12%", trend: "up" },
	{ title: "Page Views", value: "5,678", change: "+5%", trend: "up" },
	{ title: "Avg. Time", value: "2:45", change: "-3%", trend: "down" },
	{ title: "Bounce Rate", value: "42%", change: "-8%", trend: "down" },
]);

const recentActivities = ref([
	{ time: "10:30 AM", event: "New user registered", site: "example.com" },
	{ time: "9:45 AM", event: "Plugin updated", site: "blog.example.com" },
	{ time: "Yesterday", event: "Backup completed", site: "shop.example.com" },
]);

definePageMeta({
	layout: "dashboard",
});
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <h2 class="text-2xl font-bold">Analytics</h2>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        class="bg-white rounded-lg shadow p-4 flex flex-col"
      >
        <div class="text-gray-500">{{ stat.title }}</div>
        <div class="text-2xl font-bold">{{ stat.value }}</div>
        <div 
          class="mt-2 text-sm"
          :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'"
        >
          {{ stat.change }} {{ stat.trend === 'up' ? '↑' : '↓' }}
        </div>
      </div>
    </div>
    
    <!-- Chart Placeholder -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold">Traffic Overview</h3>
      <div class="h-64 bg-gray-100 rounded mt-2 flex items-center justify-center">
        <p class="text-gray-500">Chart will be displayed here</p>
      </div>
    </div>
    
    <!-- Recent Activities -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold">Recent Activities</h3>
      <div class="mt-2">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.time + activity.event"
          class="py-2 border-b border-gray-100 last:border-0"
        >
          <div class="flex justify-between">
            <span class="font-medium">{{ activity.event }}</span>
            <span class="text-gray-500 text-sm">{{ activity.time }}</span>
          </div>
          <div class="text-gray-500 text-sm">{{ activity.site }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
