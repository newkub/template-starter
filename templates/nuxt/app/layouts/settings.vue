<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
	layout: "dashboard",
});

const navItems = ref([
	{ name: "general", label: "General", path: "/dashboard/settings" },
	{ name: "security", label: "Security", path: "/dashboard/settings/security" },
]);

const activeTab = ref("");
</script>

<template>
  <div class="flex flex-col">
    <NavItems :menu-items="navItems" v-model="activeTab" direction="horizontal" />
    <slot />
  </div>
</template>
