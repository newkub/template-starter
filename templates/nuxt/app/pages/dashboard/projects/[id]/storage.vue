<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const projectId = computed(() => route.params.id);

// Storage data
const storageStats = ref({
	total: 1024, // MB
	used: 356,
	files: 124,
});

const storageUsage = computed(() => ({
	percent: Math.round(
		(storageStats.value.used / storageStats.value.total) * 100,
	),
	remaining: storageStats.value.total - storageStats.value.used,
}));

// File data
const files = ref([
	{
		id: 1,
		name: "header.jpg",
		type: "image",
		size: "2.4 MB",
		uploaded: "2025-06-20",
	},
	{
		id: 2,
		name: "product-catalog.pdf",
		type: "document",
		size: "5.1 MB",
		uploaded: "2025-06-18",
	},
	{
		id: 3,
		name: "theme-assets.zip",
		type: "archive",
		size: "45.2 MB",
		uploaded: "2025-06-15",
	},
	{
		id: 4,
		name: "config.json",
		type: "code",
		size: "0.1 MB",
		uploaded: "2025-06-10",
	},
]);

const searchQuery = ref("");
const filteredFiles = computed(() => {
	return files.value.filter((file) =>
		file.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
	);
});

// File actions
const handleUpload = (event: Event) => {
	const input = event.target as HTMLInputElement;
	if (input.files?.length) {
		// TODO: Implement upload logic
		console.log("Uploading files:", input.files);
	}
};

const handleDelete = (id: number) => {
	// TODO: Implement delete logic
	files.value = files.value.filter((file) => file.id !== id);
};
</script>

<template>
  <div class="p-8 bg-background min-h-screen">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-semibold mb-8">Storage Management</h1>
      
      <!-- Storage Overview -->
      <div class="bg-background-block rounded-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium">Storage Usage</h2>
          <span class="text-sm text-text/60">
            {{ storageStats.used }} MB of {{ storageStats.total }} MB used
          </span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            class="bg-brand h-2.5 rounded-full" 
            :style="`width: ${storageUsage.percent}%`"
            :class="{
              'bg-brand-success': storageUsage.percent < 70,
              'bg-brand-warning': storageUsage.percent >= 70 && storageUsage.percent < 90,
              'bg-brand-error': storageUsage.percent >= 90
            }"
          />
        </div>
        
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="bg-background p-4 rounded-lg">
            <p class="text-sm text-text/60 mb-1">Total Files</p>
            <p class="text-2xl font-medium">{{ storageStats.files }}</p>
          </div>
          <div class="bg-background p-4 rounded-lg">
            <p class="text-sm text-text/60 mb-1">Used Space</p>
            <p class="text-2xl font-medium">{{ storageStats.used }} MB</p>
          </div>
          <div class="bg-background p-4 rounded-lg">
            <p class="text-sm text-text/60 mb-1">Remaining</p>
            <p class="text-2xl font-medium">{{ storageUsage.remaining }} MB</p>
          </div>
        </div>
      </div>
      
      <!-- File Management -->
      <div class="bg-background-block rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium">Files</h2>
          
          <div class="flex space-x-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search files..."
              class="px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
            />
            
            <label class="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors cursor-pointer">
              Upload
              <input type="file" class="hidden" @change="handleUpload" multiple>
            </label>
          </div>
        </div>
        
        <!-- Files Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-text/60">Name</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-text/60">Type</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-text/60">Size</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-text/60">Uploaded</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-text/60">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="file in filteredFiles" :key="file.id" class="hover:bg-background/50">
                <td class="px-4 py-3 text-sm">
                  <div class="flex items-center">
                    <div class="mr-2 text-lg" :class="{
                      'i-mdi-file-image text-blue-500': file.type === 'image',
                      'i-mdi-file-pdf text-red-500': file.type === 'document',
                      'i-mdi-folder-zip text-yellow-500': file.type === 'archive',
                      'i-mdi-code-json text-green-500': file.type === 'code'
                    }" />
                    {{ file.name }}
                  </div>
                </td>
                <td class="px-4 py-3 text-sm capitalize">{{ file.type }}</td>
                <td class="px-4 py-3 text-sm">{{ file.size }}</td>
                <td class="px-4 py-3 text-sm">{{ file.uploaded }}</td>
                <td class="px-4 py-3 text-sm text-right">
                  <button 
                    @click="handleDelete(file.id)"
                    class="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <div class="i-mdi-trash" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredFiles.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-text/60">
                  No files found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
