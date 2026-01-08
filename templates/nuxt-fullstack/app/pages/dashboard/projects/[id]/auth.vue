<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

// Composable imports
import { useAuthManagement } from "~/composables/useAuthManagement";

// Components
import AuthForms from "~/components/AuthForms.vue";

const route = useRoute();
const projectId = computed(() => Number(route.params.id));

// State management
type AuthTab = "login" | "register" | "forgot";
type ManagementTab = "users" | "settings" | "providers";
const activeTab = ref<ManagementTab>("users");
const currentAuthTab = ref<AuthTab>("login");

// Mock data
const users = ref([
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		role: "admin",
		status: "active",
		lastLogin: "2023-05-15T10:30:00Z",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		role: "editor",
		status: "active",
		lastLogin: "2023-05-14T15:45:00Z",
	},
	{
		id: 3,
		name: "Bob Johnson",
		email: "bob@example.com",
		role: "viewer",
		status: "inactive",
		lastLogin: "2023-04-20T08:15:00Z",
	},
]);

const authSettings = ref({
	requireVerification: true,
	passwordMinLength: 8,
	enable2FA: false,
	loginAttempts: 5,
	lockoutDuration: 30,
	authProviders: ["email", "google", "github"],
});

const auth = ref({
	email: "",
	password: "",
	confirmPassword: "",
	name: "",
	rememberMe: false,
	isLoading: false,
	errorMessage: "",
	successMessage: "",
	showPassword: false,
	passwordStrength: 0,
	handleAuth: () => {},
});

// Methods
const updateUserRole = (userId: number, newRole: string) => {
	const user = users.value.find((u) => u.id === userId);
	if (user) user.role = newRole;
};

const toggleUserStatus = (userId: number) => {
	const user = users.value.find((u) => u.id === userId);
	if (user) user.status = user.status === "active" ? "inactive" : "active";
};
</script>

<template>
  <div class="space-y-8">
    <!-- Tab Navigation -->
    <div class="flex border-b">
      <button
        v-for="tab in ['users', 'settings', 'providers']"
        :key="tab"
        @click="activeTab = tab as ManagementTab"
        class="px-4 py-2 font-medium"
        :class="{
          'text-primary border-b-2 border-primary': activeTab === tab,
          'text-muted-foreground': activeTab !== tab
        }"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Users Management -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">User Management</h2>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
          Add User
        </button>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-muted">
            <tr>
              <th class="p-4 text-left">User</th>
              <th class="p-4 text-left">Email</th>
              <th class="p-4 text-left">Role</th>
              <th class="p-4 text-left">Status</th>
              <th class="p-4 text-left">Last Login</th>
              <th class="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t hover:bg-muted/50 transition-colors">
              <td class="p-4">{{ user.name }}</td>
              <td class="p-4">{{ user.email }}</td>
              <td class="p-4">
                <select 
                  :value="user.role"
                  @change="updateUserRole(user.id, ($event.target as HTMLSelectElement).value)"
                  class="bg-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 rounded-full text-xs"
                  :class="{
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-red-100 text-red-800': user.status === 'inactive'
                  }"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="p-4">{{ new Date(user.lastLogin).toLocaleString() }}</td>
              <td class="p-4">
                <button 
                  @click="toggleUserStatus(user.id)"
                  class="text-sm px-3 py-1 rounded"
                  :class="{
                    'bg-red-100 text-red-800': user.status === 'active',
                    'bg-green-100 text-green-800': user.status === 'inactive'
                  }"
                >
                  {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Authentication Settings -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
      <h2 class="text-xl font-semibold">Authentication Settings</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Security Settings -->
        <div class="border rounded-lg p-6 space-y-4">
          <h3 class="font-semibold">Security</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="authSettings.requireVerification" />
              <span>Require Email Verification</span>
            </label>
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="authSettings.enable2FA" />
              <span>Enable Two-Factor Authentication</span>
            </label>
          </div>
        </div>

        <!-- Password Policy -->
        <div class="border rounded-lg p-6 space-y-4">
          <h3 class="font-semibold">Password Policy</h3>
          <div class="space-y-2">
            <label>Minimum Password Length</label>
            <input
              type="number"
              v-model.number="authSettings.passwordMinLength"
              min="6"
              max="32"
              class="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <!-- Account Protection -->
        <div class="border rounded-lg p-6 space-y-4">
          <h3 class="font-semibold">Account Protection</h3>
          <div class="space-y-2">
            <label>Login Attempts Limit</label>
            <input
              type="number"
              v-model.number="authSettings.loginAttempts"
              min="1"
              max="10"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="space-y-2">
            <label>Lockout Duration (minutes)</label>
            <input
              type="number"
              v-model.number="authSettings.lockoutDuration"
              min="1"
              max="1440"
              class="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <button class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
        Save Settings
      </button>
    </div>

    <!-- Auth Providers -->
    <div v-if="activeTab === 'providers'" class="space-y-6">
      <h2 class="text-xl font-semibold">Authentication Providers</h2>
      
      <div class="border rounded-lg p-6 space-y-4">
        <div v-for="provider in ['email', 'google', 'github', 'facebook']" :key="provider" class="flex items-center justify-between p-4 border rounded">
          <div class="flex items-center gap-3">
            <img 
              :src="`https://logo.clearbit.com/${provider}.com`" 
              :alt="provider" 
              class="w-6 h-6 object-contain"
              v-if="provider !== 'email'"
            />
            <span class="capitalize">{{ provider }}</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="authSettings.authProviders" :value="provider" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>

    <AuthForms 
      :active-tab="currentAuthTab"
      @update:active-tab="currentAuthTab = $event"
      :email="auth.email"
      :password="auth.password"
      :confirm-password="auth.confirmPassword"
      :name="auth.name"
      :remember-me="auth.rememberMe"
      :is-loading="auth.isLoading"
      :error-message="auth.errorMessage"
      :success-message="auth.successMessage"
      :show-password="auth.showPassword"
      :password-strength="auth.passwordStrength"
      @submit="auth.handleAuth"
      class="mt-8"
    />
  </div>
</template>