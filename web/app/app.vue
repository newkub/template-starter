<script setup lang="ts">
import { ref } from "vue";

const menuItems = ref([
	{ name: "Home", path: "/" },
	{ name: "Dashboard", path: "/dashboard" },
]);
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <div class="max-w-7xl xl:max-w-8xl mx-auto w-full px-4 md:px-0">
        <main>
          <NuxtPage />
        </main>
      </div>
    </NuxtLayout>
  </div>
</template>
