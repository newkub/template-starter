
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

interface TeamMember {
	id: number;
	name: string;
	email: string;
	role: "Admin" | "Member";
	avatar: string;
}

const route = useRoute();
const projectId = computed(() => Number(route.params.id));

// Team members data
const teamMembers = ref<TeamMember[]>([
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		role: "Admin",
		avatar: "JD",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		role: "Member",
		avatar: "JS",
	},
]);

// UI states
const isAddDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const selectedMember = ref<TeamMember | null>(null);
const searchQuery = ref("");

// Filter members based on search
const filteredMembers = computed(() => {
	return teamMembers.value.filter(
		(member) =>
			member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			member.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
	);
});

// Handle delete member
const handleDelete = (member: TeamMember) => {
	selectedMember.value = member;
	isDeleteDialogOpen.value = true;
};

// Confirm delete
const confirmDelete = () => {
	if (!selectedMember.value) return;
	teamMembers.value = teamMembers.value.filter(
		(m) => m.id !== selectedMember.value?.id,
	);
	isDeleteDialogOpen.value = false;
};
</script>

<template>
  <div class="p-8 bg-background min-h-screen">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">Team Management</h1>
        
        <div class="flex space-x-4">
          <div class="relative">
            <div class="i-mdi-magnify absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search team members..."
              class="pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
          
          <button 
            @click="isAddDialogOpen = true"
            class="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Add Member
          </button>
        </div>
      </div>
      
      <!-- Team members list -->
      <div class="bg-background-block rounded-xl overflow-hidden">
        <div class="divide-y divide-border">
          <div 
            v-for="member in filteredMembers" 
            :key="member.id"
            class="p-4 hover:bg-background/50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-medium">
                  {{ member.avatar }}
                </div>
                <div>
                  <p class="font-medium">{{ member.name }}</p>
                  <p class="text-sm text-text/60">{{ member.email }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs"
                  :class="{
                    'bg-brand/10 text-brand': member.role === 'Admin',
                    'bg-text/10 text-text': member.role === 'Member'
                  }"
                >
                  {{ member.role }}
                </span>
                
                <button 
                  @click="handleDelete(member)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <div class="i-mdi-trash" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="filteredMembers.length === 0" class="p-8 text-center text-text/60">
            <div class="i-mdi-account-group-outline text-4xl mx-auto mb-2" />
            <p>No team members found</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete confirmation dialog -->
    <div 
      v-if="isDeleteDialogOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-background-block rounded-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold mb-4">Remove Team Member</h2>
        <p class="mb-6">Are you sure you want to remove {{ selectedMember?.name }} from the team?</p>
        
        <div class="flex justify-end space-x-4">
          <button 
            @click="isDeleteDialogOpen = false"
            class="px-4 py-2 rounded-lg border border-border hover:bg-background/50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>