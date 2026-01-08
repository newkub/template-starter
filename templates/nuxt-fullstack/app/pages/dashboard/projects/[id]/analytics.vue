<script setup lang="ts">
import { useFetch, ref, computed } from "#imports";

interface AnalyticsData {
	visitors: number;
	pageViews: number;
	bounceRate: number;
	avgSessionDuration: number;
	trafficSources: {
		direct: number;
		organic: number;
		referral: number;
		social: number;
	};
	chartData: Array<{
		date: string;
		visitors: number;
		pageViews: number;
	}>;
}

const dateRange = ref("7days");
const {
	data: analytics,
	pending,
	error,
} = useFetch<AnalyticsData>(`/api/analytics?range=${dateRange.value}`);

const formatNumber = (num: number) => {
	return new Intl.NumberFormat().format(num);
};

const formatDuration = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}m ${secs}s`;
};
</script>

<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">Analytics</h2>
      
      <select 
        v-model="dateRange"
        class="px-3 py-2 border rounded"
        @change="refreshNuxtData()"
      >
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
      </select>
    </div>

    <div v-if="pending" class="flex justify-center">
      <Spinner />
    </div>

    <div v-else-if="error" class="p-4 text-red-500 bg-red-50 rounded">
      Error loading analytics: {{ error.message }}
    </div>

    <div v-else>
      <div v-if="analytics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Visitors" 
          :value="formatNumber(analytics.visitors)" 
          icon="users"
        />
        <MetricCard 
          title="Page Views" 
          :value="formatNumber(analytics.pageViews)" 
          icon="eye"
        />
        <MetricCard 
          title="Avg. Session" 
          :value="formatDuration(analytics.avgSessionDuration)" 
          icon="clock"
        />
        <MetricCard 
          title="Bounce Rate" 
          :value="`${analytics.bounceRate}%`" 
          icon="arrow-uturn-left"
        />
      </div>

      <div v-if="analytics" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white p-4 rounded shadow">
          <h3 class="text-lg font-medium mb-4">Traffic Overview</h3>
          <LineChart :data="analytics.chartData" />
        </div>
        
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-medium mb-4">Traffic Sources</h3>
          <PieChart :data="[
            { name: 'Direct', value: analytics.trafficSources.direct },
            { name: 'Organic', value: analytics.trafficSources.organic },
            { name: 'Referral', value: analytics.trafficSources.referral },
            { name: 'Social', value: analytics.trafficSources.social }
          ]" />
        </div>
      </div>
    </div>
  </div>
</template>
