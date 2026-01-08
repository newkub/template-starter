<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Welcome to Nuxt Monorepo</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        {{ hello() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hello } from 'shared'
</script>
