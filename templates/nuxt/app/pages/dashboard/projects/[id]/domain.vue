<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const projectId = computed(() => Number(route.params.id));

// Domain data
const domains = ref([
	{
		id: 1,
		name: "example.com",
		status: "Active",
		ssl: true,
		expiryDate: "2025-12-31",
	},
	{
		id: 2,
		name: "blog.example.com",
		status: "Active",
		ssl: false,
		expiryDate: "2025-10-15",
	},
]);

const newDomain = ref("");
const isAddingDomain = ref(false);
const errorMessage = ref("");

const addDomain = () => {
	if (!newDomain.value) {
		errorMessage.value = "Please enter a domain name";
		return;
	}

	// Validate domain format
	const domainRegex =
		/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
	if (!domainRegex.test(newDomain.value)) {
		errorMessage.value = "Please enter a valid domain name";
		return;
	}

	domains.value.push({
		id: domains.value.length + 1,
		name: newDomain.value,
		status: "Pending",
		ssl: false,
		expiryDate: "2025-12-31",
	});

	newDomain.value = "";
	isAddingDomain.value = false;
	errorMessage.value = "";
};
</script>

<template>
  <div class="p-8 bg-background min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold mb-8">Domain Management</h1>
      
      <div class="bg-background-block rounded-xl p-6 mb-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-medium">Your Domains</h2>
          <button 
            @click="isAddingDomain = true"
            class="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Add Domain
          </button>
        </div>
        
        <!-- Add domain form -->
        <div v-if="isAddingDomain" class="mb-6 p-4 bg-background rounded-lg">
          <div class="flex items-end space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Domain Name</label>
              <input
                v-model="newDomain"
                type="text"
                placeholder="example.com"
                class="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>
            <button 
              @click="addDomain"
              class="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Save
            </button>
          </div>
          <p v-if="errorMessage" class="mt-2 text-red-500 text-sm">{{ errorMessage }}</p>
        </div>
        
        <!-- Domains list -->
        <div class="divide-y divide-border">
          <div 
            v-for="domain in domains" 
            :key="domain.id"
            class="py-4 flex items-center justify-between"
          >
            <div>
              <div class="flex items-center space-x-3">
                <p class="font-medium">{{ domain.name }}</p>
                <span 
                  class="px-2 py-0.5 rounded-full text-xs"
                  :class="{
                    'bg-brand-success/10 text-brand-success': domain.status === 'Active',
                    'bg-brand-warning/10 text-brand-warning': domain.status === 'Pending',
                    'bg-brand-error/10 text-brand-error': domain.status === 'Expired'
                  }"
                >
                  {{ domain.status }}
                </span>
                <span 
                  v-if="domain.ssl"
                  class="px-2 py-0.5 rounded-full text-xs bg-brand/10 text-brand"
                >
                  SSL
                </span>
              </div>
              <p class="text-sm text-text/60 mt-1">
                Expires on {{ domain.expiryDate }}
              </p>
            </div>
            
            <div class="flex space-x-3">
              <button class="text-brand hover:text-brand/80 transition-colors">
                <div class="i-mdi-cog" />
              </button>
              <button class="text-red-500 hover:text-red-700 transition-colors">
                <div class="i-mdi-trash" />
              </button>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="domains.length === 0" class="py-8 text-center text-text/60">
            <div class="i-mdi-web text-4xl mx-auto mb-2" />
            <p>No domains added yet</p>
          </div>
        </div>
      </div>
      
      <!-- DNS Settings -->
      <div class="bg-background-block rounded-xl p-6">
        <h2 class="text-lg font-medium mb-4">DNS Settings</h2>
        <p class="text-text/60 mb-6">Configure your DNS records for optimal performance</p>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-text/60">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text/60">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text/60">Value</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text/60">TTL</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr>
                <td class="px-4 py-3 text-sm">A</td>
                <td class="px-4 py-3 text-sm">@</td>
                <td class="px-4 py-3 text-sm font-mono">192.0.2.1</td>
                <td class="px-4 py-3 text-sm">3600</td>
              </tr>
              <tr>
                <td class="px-4 py-3 text-sm">CNAME</td>
                <td class="px-4 py-3 text-sm">www</td>
                <td class="px-4 py-3 text-sm font-mono">example.com</td>
                <td class="px-4 py-3 text-sm">3600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
