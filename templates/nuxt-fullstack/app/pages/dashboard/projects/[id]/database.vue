<script setup lang="ts">
import { ref } from "vue";

const databases = ref([
	{ name: "wordpress_db", size: "45MB", tables: 12 },
	{ name: "analytics_db", size: "120MB", tables: 8 },
]);

const selectedDb = ref<string | null>(null);
const isBackingUp = ref(false);

const handleSelectDb = (dbName: string) => {
	selectedDb.value = dbName;
};

const handleBackup = () => {
	isBackingUp.value = true;
	// Backup logic here
	setTimeout(() => {
		isBackingUp.value = false;
	}, 2000);
};
</script>

<template>
  <div class="p4 max-w-1200px mx-auto">
    <h2 class="text-xl font-bold mb4">Database Management</h2>
    
    <div class="flex gap4">
      <!-- Database List -->
      <div class="w-1/3 bg-white rounded shadow p4">
        <h3 class="text-lg font-semibold mb2">Your Databases</h3>
        <ul class="divide-y">
          <li 
            v-for="db in databases" 
            :key="db.name"
            @click="handleSelectDb(db.name)"
            class="py2 px2 cursor-pointer hover:bg-gray-100"
            :class="{ 'bg-blue-50': selectedDb === db.name }"
          >
            <div class="font-medium">{{ db.name }}</div>
            <div class="text-sm text-gray-500">
              {{ db.size }} • {{ db.tables }} tables
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Database Actions -->
      <div class="flex-1 bg-white rounded shadow p4">
        <div v-if="selectedDb" class="space-y4">
          <h3 class="text-lg font-semibold">{{ selectedDb }}</h3>
          
          <div class="flex gap2">
            <button class="btn bg-blue-500 text-white px3 py1 rounded hover:bg-blue-600">
              Optimize
            </button>
            <button 
              class="btn bg-green-500 text-white px3 py1 rounded hover:bg-green-600"
              @click="handleBackup"
              :disabled="isBackingUp"
            >
              {{ isBackingUp ? 'Backing Up...' : 'Backup Now' }}
            </button>
            <button class="btn bg-red-500 text-white px3 py1 rounded hover:bg-red-600">
              Drop Database
            </button>
          </div>
          
          <div class="border-t pt4">
            <h4 class="font-medium mb2">Recent Backups</h4>
            <div class="bg-gray-50 p3 rounded text-sm">
              No backups available
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py8 text-gray-500">
          Select a database to view details
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  transition: background-color 0.2s;
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
