<script setup lang="ts">
import { useRoute } from "vue-router";

defineProps<{
	menuItems: Array<{ name: string; path: string }>;
	direction?: "horizontal" | "vertical";
}>();

const route = useRoute();
</script>

<template>
  <div 
    class="flex"
    :class="{
      'flex-col gap-2': direction === 'vertical',
      'items-center gap-4': direction === 'horizontal'
    }"
  >
    <NuxtLink 
      v-for="item in menuItems" 
      :key="item.path"
      :to="item.path"
      class="block py-2 px-4 rounded hover:bg-brand/10 transition-colors"
      :class="{
        'bg-brand/20 text-brand font-medium': route.path === item.path,
        'hover:text-brand': direction === 'horizontal',
        'text-brand': direction === 'horizontal' && route.path === item.path
      }"
    >
      {{ item.name }}
    </NuxtLink>
  </div>
</template>
