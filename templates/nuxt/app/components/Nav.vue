<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDark, useToggle } from "@vueuse/core";
import NavItems from "./NavItems.vue";

defineProps<{
	menuItems: Array<{ name: string; path: string }>;
}>();

const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);
const isDark = useDark();
const toggleTheme = useToggle(isDark);

const goToHome = () => {
	router.push("/");
};

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="flex items-center justify-between p-2">
    <!-- Logo -->
    <div class="flex items-center cursor-pointer" @click="goToHome">
      <img 
        src="/favicon.ico" 
        alt="Logo" 
        class="h-10 w-auto"
      />
    </div>

    <!-- Menu Items - Centered -->
    <div class="flex-1 flex justify-center">
      <NavItems 
        :menu-items="menuItems" 
        :is-mobile="false"
      />
    </div>

    <!-- Right Section - Theme Toggle and Mobile Menu -->
    <div class="flex items-center gap-4">
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme()"
        class="p-2 rounded-full hover:bg-gray-200"
      >
        <div v-if="isDark" class="i-mdi-weather-night text-xl" />
        <div v-else class="i-mdi-white-balance-sunny text-xl" />
      </button>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden"
        @click="toggleMenu"
      >
        <div class="i-mdi-menu text-2xl" />
      </button>
    </div>

    <!-- Mobile Menu Items -->
    <NavItems 
      v-if="isMenuOpen"
      :menu-items="menuItems" 
      :is-mobile="true"
    />
  </nav>
</template>
