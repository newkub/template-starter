<script setup lang="ts">
import NavItems from "~/components/NavItems.vue";
import { ref } from "vue";

const activeTab = ref("");

const navItems = ref([
	{ name: "Overview", path: "/dashboard" },
	{ name: "Analytics", path: "/dashboard/analytics" },
	{ name: "Projects", path: "/dashboard/projects" },
	{ name: "Integrations", path: "/dashboard/integrations" },
	{ name: "Usage", path: "/dashboard/usage" },
	{ name: "Settings", path: "/dashboard/settings" },
]);
</script>

<template>
  <div class="flex flex-col">
      <NavItems :menu-items="navItems" v-model="activeTab" direction="horizontal" />
    <slot />
  </div>
</template>
