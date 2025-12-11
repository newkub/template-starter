<script setup lang="ts">
import { useState, onMounted } from "#imports";

interface Deployment {
	id: string;
	status: "success" | "failed" | "pending";
	timestamp: string;
	commitMessage: string;
	branch: string;
	duration?: number;
}

const currentDeployment = useState<Deployment | null>(
	"currentDeployment",
	() => null,
);
const deploymentHistory = useState<Deployment[]>("deploymentHistory", () => []);
const isDeploying = useState<boolean>("isDeploying", () => false);

// Fetch initial data
onMounted(async () => {
	await refreshDeployments();
});

const refreshDeployments = async () => {
	try {
		const [current, history] = await Promise.all([
			$fetch("/api/deployments/current"),
			$fetch("/api/deployments"),
		]);

		currentDeployment.value = {
			...current,
			commitMessage: current.commitMessage || "No commit message",
			branch: current.branch || "main",
			status:
				current.status === "success" ||
				current.status === "failed" ||
				current.status === "pending"
					? current.status
					: "pending",
		};

		deploymentHistory.value = history.map((d) => ({
			...d,
			commitMessage: d.commitMessage || "No commit message",
			branch: d.branch || "main",
			status:
				d.status === "success" ||
				d.status === "failed" ||
				d.status === "pending"
					? d.status
					: "pending",
		}));
	} catch (error) {
		console.error("Failed to fetch deployments:", error);
	}
};

const triggerDeployment = async () => {
	try {
		isDeploying.value = true;

		// Call API to trigger deployment
		const newDeployment = await $fetch<Deployment>("/api/deployments", {
			method: "POST",
			body: {
				commitMessage: "Manual deployment",
				branch: "main",
				status: "pending",
				timestamp: new Date().toISOString(),
				duration: 0,
			} as Deployment,
		});

		// Update local state
		currentDeployment.value = newDeployment;
		deploymentHistory.value.unshift(newDeployment);
	} catch (error) {
		console.error("Deployment failed:", error);
	} finally {
		isDeploying.value = false;
	}
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString();
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Deployment Status Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Current Deployment</h2>
        <button 
          @click="triggerDeployment"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          :disabled="isDeploying"
        >
          {{ isDeploying ? 'Deploying...' : 'Deploy Now' }}
        </button>
      </div>

      <div v-if="currentDeployment" class="space-y-2">
        <div class="flex items-center">
          <span class="w-32 text-gray-500">Status:</span>
          <span 
            class="px-2 py-1 rounded text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': currentDeployment.status === 'success',
              'bg-red-100 text-red-800': currentDeployment.status === 'failed',
              'bg-yellow-100 text-yellow-800': currentDeployment.status === 'pending'
            }"
          >
            {{ currentDeployment.status }}
          </span>
        </div>
        <div class="flex">
          <span class="w-32 text-gray-500">Last Deployed:</span>
          <span>{{ formatDate(currentDeployment.timestamp) }}</span>
        </div>
        <div class="flex">
          <span class="w-32 text-gray-500">Branch:</span>
          <span>{{ currentDeployment.branch }}</span>
        </div>
        <div class="flex">
          <span class="w-32 text-gray-500">Commit:</span>
          <span>{{ currentDeployment.commitMessage }}</span>
        </div>
      </div>
      <div v-else class="text-gray-500">
        No deployment information available
      </div>
    </div>

    <!-- Deployment History -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Deployment History</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commit</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="deploy in deploymentHistory" :key="deploy.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 rounded text-sm font-medium"
                  :class="{
                    'bg-green-100 text-green-800': deploy.status === 'success',
                    'bg-red-100 text-red-800': deploy.status === 'failed',
                    'bg-yellow-100 text-yellow-800': deploy.status === 'pending'
                  }"
                >
                  {{ deploy.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDate(deploy.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ deploy.branch }}
              </td>
              <td class="px-6 py-4">
                {{ deploy.commitMessage }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ deploy.duration }}s
              </td>
            </tr>
            <tr v-if="deploymentHistory.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No deployment history available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
