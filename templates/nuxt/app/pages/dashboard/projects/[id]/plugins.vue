<script setup lang="ts">
interface Plugin {
	id: string;
	name: string;
	description: string;
	isActive: boolean;
	hasUpdate: boolean;
}

const {
	data: plugins,
	pending,
	error,
	refresh,
} = useAsyncData("plugins", () => $fetch("/api/plugins"));

const searchQuery = ref("");
const filteredPlugins = computed(() => {
	if (!plugins.value) return [];
	return plugins.value.filter((plugin: Plugin) =>
		plugin.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
	);
});

const pluginActions = {
	activate: async (id: string) => {
		await $fetch(`/api/plugins/${id}/activate`, { method: "POST" });
		refresh();
	},
	deactivate: async (id: string) => {
		await $fetch(`/api/plugins/${id}/deactivate`, { method: "POST" });
		refresh();
	},
	update: async (id: string) => {
		await $fetch(`/api/plugins/${id}/update`, { method: "POST" });
		refresh();
	},
};
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">Plugins</h2>
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search plugins..."
        class="px-3 py-2 border rounded"
      />
    </div>

    <div v-if="pending" class="flex justify-center">
      <Spinner />
    </div>

    <div v-else-if="error" class="p-4 text-red-500 bg-red-50 rounded">
      Error loading plugins: {{ error.message }}
    </div>

    <div v-else class="space-y-2">
      <div 
        v-for="plugin in filteredPlugins" 
        :key="plugin.id"
        class="p-4 border rounded hover:shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">{{ plugin.name }}</h3>
            <p class="text-sm text-gray-500">{{ plugin.description }}</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              v-if="!plugin.isActive"
              @click="pluginActions.activate(plugin.id)"
              class="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Activate
            </button>
            
            <button 
              v-else
              @click="pluginActions.deactivate(plugin.id)"
              class="px-3 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Deactivate
            </button>
            
            <button 
              v-if="plugin.hasUpdate"
              @click="pluginActions.update(plugin.id)"
              class="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
