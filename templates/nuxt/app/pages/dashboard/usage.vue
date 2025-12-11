<script setup lang="ts">
import { ref } from "vue";
import { useHead, definePageMeta } from "#imports";

definePageMeta({
	layout: "dashboard",
});

interface UsageItem {
	icon: string;
	color: string;
}

interface UsageWithTotal extends UsageItem {
	used: number;
	total: number;
}

interface UsagePercentage extends UsageItem {
	used: number;
}

interface UsageCount extends UsageItem {
	count: number;
	limit: number;
}

interface UptimeStatus extends UsageItem {
	status: "active" | "warning" | "error";
	lastCheck: string;
}

const usageData = ref<{
	bandwidth: UsageWithTotal;
	storage: UsageWithTotal;
	cpu: UsagePercentage;
	memory: UsageWithTotal;
	requests: UsageCount;
	uptime: UptimeStatus;
}>({
	bandwidth: {
		used: 0,
		total: 1000, // GB
		icon: "i-mdi-cloud-upload",
		color: "bg-blue-500",
	},
	storage: {
		used: 0,
		total: 50, // GB
		icon: "i-mdi-database",
		color: "bg-green-500",
	},
	cpu: {
		used: 0, // %
		icon: "i-mdi-chip",
		color: "bg-purple-500",
	},
	memory: {
		used: 0, // MB
		total: 4096, // MB
		icon: "i-mdi-memory",
		color: "bg-orange-500",
	},
	requests: {
		count: 0, // จำนวน request
		limit: 10000, // ครั้ง/เดือน
		icon: "i-mdi-api",
		color: "bg-indigo-500",
	},
	uptime: {
		status: "active", // active, warning, error
		lastCheck: "",
		icon: "i-mdi-heart-pulse",
		color: "bg-green-500",
	},
});

const getUsageColor = (percent: number) => {
	if (percent > 90) return "bg-red-500";
	if (percent > 70) return "bg-yellow-500";
	return "bg-blue-500";
};

const bandwidthHistory = [
	{ day: "Mon", usage: 30 },
	{ day: "Tue", usage: 45 },
	{ day: "Wed", usage: 60 },
	{ day: "Thu", usage: 25 },
	{ day: "Fri", usage: 75 },
	{ day: "Sat", usage: 50 },
	{ day: "Sun", usage: 40 },
];

const cpuHistory = [
	{ day: "Mon", usage: 20 },
	{ day: "Tue", usage: 35 },
	{ day: "Wed", usage: 50 },
	{ day: "Thu", usage: 15 },
	{ day: "Fri", usage: 65 },
	{ day: "Sat", usage: 30 },
	{ day: "Sun", usage: 25 },
];

const requestsHistory = [
	{ day: "Mon", usage: 40 },
	{ day: "Tue", usage: 55 },
	{ day: "Wed", usage: 70 },
	{ day: "Thu", usage: 35 },
	{ day: "Fri", usage: 85 },
	{ day: "Sat", usage: 60 },
	{ day: "Sun", usage: 45 },
];

useHead({
	title: "Usage Dashboard",
});
</script>

<template>
  <div class="space-y-8">
    <!-- ส่วนแสดงข้อมูลปัจจุบัน -->
    <h1 class="text-2xl font-bold">Resource Usage</h1>
    
    <div class="grid grid-cols-6 gap-4">
      <div 
        v-for="(stat, key) in usageData" 
        :key="key"
        class="bg-background-block rounded-xl p-4"
      >
        <div class="flex items-center gap-2">
          <div :class="[stat.icon, stat.color]" class="text-xl rounded-full p-1"></div>
          <h3 class="text-sm font-medium capitalize">{{ key }}</h3>
        </div>
        
        <div class="mt-2">
          <!-- สำหรับเมตริกที่มี used และ total -->
          <div v-if="'used' in stat && 'total' in stat" class="text-xs">
            <div class="flex justify-between">
              <span class="text-muted-foreground">
                {{ stat.used }}{{ key === 'memory' ? 'MB' : 'GB' }}
              </span>
              <span class="text-muted-foreground">
                /{{ stat.total }}{{ key === 'memory' ? 'MB' : 'GB' }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                class="h-1.5 rounded-full" 
                :class="[getUsageColor((stat.used / stat.total) * 100)]"
                :style="{ width: `${Math.min(100, (stat.used / stat.total) * 100)}%` }"
              ></div>
            </div>
            <div class="text-right mt-0.5 text-xs font-medium" 
                 :class="{
                   'text-red-500': (stat.used / stat.total) * 100 > 90,
                   'text-yellow-500': (stat.used / stat.total) * 100 > 70 && (stat.used / stat.total) * 100 <= 90,
                   'text-green-500': (stat.used / stat.total) * 100 <= 70
                 }">
              {{ Math.round((stat.used / stat.total) * 100) }}%
            </div>
          </div>
          
          <!-- สำหรับ CPU (มีเฉพาะ used) -->
          <div v-else-if="'used' in stat && key === 'cpu'" class="text-xs">
            <div class="text-muted-foreground">
              {{ stat.used }}%
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                class="h-1.5 rounded-full" 
                :class="[getUsageColor(stat.used)]"
                :style="{ width: `${Math.min(100, stat.used)}%` }"
              ></div>
            </div>
          </div>
          
          <!-- สำหรับ Requests -->
          <div v-else-if="'count' in stat" class="text-xs">
            <div class="flex justify-between">
              <span class="text-muted-foreground">
                {{ stat.count }}
              </span>
              <span class="text-muted-foreground">
                /{{ stat.limit }}
              </span>
            </div>
          </div>
          
          <!-- สำหรับ Uptime -->
          <div v-else-if="'status' in stat" class="text-xs">
            <div class="flex items-center gap-1">
              <span class="text-muted-foreground">Status:</span>
              <span 
                class="font-medium"
                :class="{
                  'text-green-500': stat.status === 'active',
                  'text-yellow-500': stat.status === 'warning',
                  'text-red-500': stat.status === 'error'
                }"
              >
                {{ stat.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ส่วน mockup ใหม่ -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Usage History</h2>
      
      <div class="bg-background-block rounded-xl p-6">
        <div class="grid grid-cols-4 gap-6">
          <!-- Bandwidth Usage -->
          <div>
            <h3 class="text-sm font-medium flex items-center gap-2 mb-2">
              <div class="i-mdi-cloud-upload bg-blue-500 text-xl rounded-full p-1"></div>
              Bandwidth
            </h3>
            <div class="h-40 bg-gray-100 rounded-lg p-2">
              <div class="h-full flex items-end gap-px">
                <div v-for="(item, index) in bandwidthHistory" :key="index" 
                  class="w-full bg-blue-500 rounded-t-sm"
                  :style="{ height: `${item.usage}%` }"></div>
              </div>
            </div>
            <div class="text-xs text-muted-foreground mt-2">
              Last 7 days
            </div>
          </div>

          <!-- CPU Usage -->
          <div>
            <h3 class="text-sm font-medium flex items-center gap-2 mb-2">
              <div class="i-mdi-chip bg-purple-500 text-xl rounded-full p-1"></div>
              CPU
            </h3>
            <div class="h-40 bg-gray-100 rounded-lg p-2">
              <div class="h-full flex items-end gap-px">
                <div v-for="(item, index) in cpuHistory" :key="index" 
                  class="w-full bg-purple-500 rounded-t-sm"
                  :style="{ height: `${item.usage}%` }"></div>
              </div>
            </div>
            <div class="text-xs text-muted-foreground mt-2">
              Last 7 days
            </div>
          </div>

          <!-- Requests -->
          <div>
            <h3 class="text-sm font-medium flex items-center gap-2 mb-2">
              <div class="i-mdi-api bg-indigo-500 text-xl rounded-full p-1"></div>
              Requests
            </h3>
            <div class="h-40 bg-gray-100 rounded-lg p-2">
              <div class="h-full flex items-end gap-px">
                <div v-for="(item, index) in requestsHistory" :key="index" 
                  class="w-full bg-indigo-500 rounded-t-sm"
                  :style="{ height: `${item.usage}%` }"></div>
              </div>
            </div>
            <div class="text-xs text-muted-foreground mt-2">
              Last 7 days
            </div>
          </div>

          <!-- Uptime Status -->
          <div>
            <h3 class="text-sm font-medium flex items-center gap-2 mb-2">
              <div class="i-mdi-heart-pulse bg-green-500 text-xl rounded-full p-1"></div>
              Uptime
            </h3>
            <div class="h-40 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
              <div class="text-center">
                <div class="text-3xl font-bold text-green-500">99.9%</div>
                <div class="text-xs text-muted-foreground">30 days average</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>