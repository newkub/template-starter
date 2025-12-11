<script setup lang="ts">
import { useFetch, reactive, computed } from "#imports";

interface Activity {
	id: string;
	type: "deploy" | "plugin" | "other";
	message: string;
	timestamp: string;
	user: string;
}

const {
	data: activities,
	pending,
	error,
} = useFetch<Activity[]>("/api/activities");

const filters = reactive({
	type: "all",
	dateRange: "7days",
});

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString();
};

const filteredActivities = computed(() => {
	if (!activities.value) return [];

	return activities.value.filter((activity) => {
		const typeMatch = filters.type === "all" || activity.type === filters.type;
		// Add date range filtering logic here
		return typeMatch;
	});
});
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">Activity Log</h2>
      
      <div class="flex space-x-2">
        <select v-model="filters.type" class="px-3 py-2 border rounded">
          <option value="all">All Activities</option>
          <option value="deploy">Deployments</option>
          <option value="plugin">Plugin Updates</option>
        </select>
        
        <select v-model="filters.dateRange" class="px-3 py-2 border rounded">
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center">
      <Spinner />
    </div>

    <div v-else-if="error" class="p-4 text-red-500 bg-red-50 rounded">
      Error loading activities: {{ error.message }}
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="activity in filteredActivities" 
        :key="activity.id"
        class="p-4 border-l-4 border-blue-500 bg-gray-50"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <ActivityIcon :type="activity.type" />
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{{ activity.message }}</p>
            <p class="text-xs text-gray-500">
              {{ formatDate(activity.timestamp) }} by {{ activity.user }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
