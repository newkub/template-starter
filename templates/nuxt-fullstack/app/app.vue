<script setup lang="ts">
import Nav from "~/components/Nav.vue";
import { ref } from "vue";
import { StagewiseToolbar, type ToolbarConfig } from "@stagewise/toolbar-vue";

const menuItems = ref([
	{ name: "Home", path: "/" },
	{ name: "Dashboard", path: "/dashboard" },
]);

const toolbarConfig: ToolbarConfig = {
	plugins: [], // เพิ่ม plugins ของคุณที่นี่
};
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <ClientOnly>
      <StagewiseToolbar :config="toolbarConfig" />
    </ClientOnly>
    <Nav :menu-items="menuItems" />
    <NuxtLayout>
      <div class="max-w-7xl xl:max-w-8xl mx-auto w-full px-4 md:px-0">
        <main>
          <NuxtPage />
        </main>
      </div>
    </NuxtLayout>
  </div>
</template>
