<script setup lang="ts">
const props = defineProps<{
	activeTab: "login" | "register" | "forgot";
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	rememberMe: boolean;
	isLoading: boolean;
	errorMessage: string;
	successMessage: string;
	showPassword: boolean;
	passwordStrength: number;
}>();

const emit = defineEmits<{
	"update:active-tab": [value: "login" | "register" | "forgot"];
	"update:email": [value: string];
	"update:password": [value: string];
	"update:confirmPassword": [value: string];
	"update:name": [value: string];
	"update:rememberMe": [value: boolean];
	"update:showPassword": [value: boolean];
	submit: [];
}>();

const updateActiveTab = (tab: "login" | "register" | "forgot") => {
	emit("update:active-tab", tab);
};
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Authentication Settings</h2>
    <div class="max-w-md mx-auto bg-background-block rounded-xl p-8 shadow-sm">
      <!-- Auth Tabs -->
      <div class="flex border-b border-border mb-6">
        <button
          @click="updateActiveTab('login')"
          class="px-4 py-2 font-medium"
          :class="{ 'text-brand border-b-2 border-brand': props.activeTab === 'login' }"
        >
          Sign In
        </button>
        <button
          @click="updateActiveTab('register')"
          class="px-4 py-2 font-medium"
          :class="{ 'text-brand border-b-2 border-brand': props.activeTab === 'register' }"
        >
          Register
        </button>
        <button
          @click="updateActiveTab('forgot')"
          class="px-4 py-2 font-medium"
          :class="{ 'text-brand border-b-2 border-brand': props.activeTab === 'forgot' }"
        >
          Forgot Password
        </button>
      </div>
      
      <!-- Success/Error Messages -->
      <div v-if="props.errorMessage" class="mb-4 p-3 bg-red-500/10 text-red-500 rounded-lg">
        {{ props.errorMessage }}
      </div>
      <div v-if="props.successMessage" class="mb-4 p-3 bg-brand-success/10 text-brand-success rounded-lg">
        {{ props.successMessage }}
      </div>
      
      <!-- Auth Forms -->
      <form @submit.prevent="emit('submit')" class="space-y-4">
        <!-- Email Field (All Forms) -->
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            :value="props.email"
            @input="emit('update:email', ($event.target as HTMLInputElement).value)"
            type="email"
            class="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <!-- Password Fields (Login/Register) -->
        <template v-if="props.activeTab !== 'forgot'">
          <div>
            <label for="password" class="block text-sm font-medium mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                :value="props.password"
                @input="emit('update:password', ($event.target as HTMLInputElement).value)"
                :type="props.showPassword ? 'text' : 'password'"
                class="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="emit('update:showPassword', !props.showPassword)"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/60"
              >
                <div :class="props.showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye'" />
              </button>
            </div>
            
            <!-- Password Strength Meter -->
            <div v-if="props.activeTab === 'register'" class="mt-2">
              <div class="flex space-x-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="h-1 flex-1 rounded"
                  :class="[
                    props.passwordStrength >= i ? 'bg-brand-success' : 'bg-border',
                    props.password && props.passwordStrength < 2 && i <= props.passwordStrength ? 'bg-brand-error' : ''
                  ]"
                />
              </div>
              <p class="text-xs mt-1 text-text/60">
                Password strength: 
                <span :class="{
                  'text-brand-error': props.passwordStrength < 2,
                  'text-brand-warning': props.passwordStrength === 2,
                  'text-brand-success': props.passwordStrength > 2
                }">
                  {{ ['Weak', 'Fair', 'Good', 'Strong'][props.passwordStrength] || 'Very Weak' }}
                </span>
              </p>
            </div>
          </div>
          
          <!-- Confirm Password (Register) -->
          <div v-if="props.activeTab === 'register'">
            <label for="confirmPassword" class="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              :value="props.confirmPassword"
              @input="emit('update:confirmPassword', ($event.target as HTMLInputElement).value)"
              type="password"
              class="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <!-- Name Field (Register) -->
          <div v-if="props.activeTab === 'register'">
            <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
            <input
              id="name"
              :value="props.name"
              @input="emit('update:name', ($event.target as HTMLInputElement).value)"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>
          
          <!-- Remember Me (Login) -->
          <div v-if="props.activeTab === 'login'" class="flex items-center">
            <input
              id="rememberMe"
              :checked="props.rememberMe"
              @change="emit('update:rememberMe', ($event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="rounded border-border text-brand focus:ring-brand"
            />
            <label for="rememberMe" class="ml-2 text-sm text-text/60">Remember me</label>
          </div>
        </template>
        
        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          :disabled="props.isLoading"
        >
          <span v-if="!props.isLoading">
            {{ props.activeTab === 'login' ? 'Sign In' : props.activeTab === 'register' ? 'Register' : 'Reset Password' }}
          </span>
          <span v-else class="flex items-center justify-center">
            <div class="i-mdi-loading animate-spin mr-2" />
            Processing...
          </span>
        </button>
      </form>
      
      <!-- Social Login (Login/Register) -->
      <template v-if="props.activeTab !== 'forgot'">
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-border" />
          <span class="px-3 text-sm text-text/60">OR</span>
          <div class="flex-1 border-t border-border" />
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <button class="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-background/50 transition-colors">
            <div class="i-mdi-google text-brand mr-2" />
            Google
          </button>
          <button class="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-background/50 transition-colors">
            <div class="i-mdi-github text-text mr-2" />
            GitHub
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
