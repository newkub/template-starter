---
layout: quote
theme: seriph
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Vue.js Workshop
  เรียนรู้พื้นฐาน Vue.js ตั้งแต่เริ่มต้น
  
drawings:
  persist: false

fonts:
  sans: Noto Sans Thai
  serif: Noto Sans Thai
  mono: Fira Code
---

# Vue.js Fundamentals

เรียนรู้พื้นฐานสำคัญของ Vue.js 3

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# Reactivity System

ระบบ Reactivity เป็นหัวใจสำคัญของ Vue.js

```js {all|1-2|4|all}
// ประกาศ reactive state
const count = ref(0)

// เมื่อค่าเปลี่ยน UI จะอัปเดตอัตโนมัติ
count.value++
```

<div v-click class="mt-4 text-sm">
  <p>ลองแก้ไขค่าใน DevTools Console:</p>
  <pre>count.value = 10</pre>
</div>

---

# Component System

Components คือส่วนประกอบที่นำมาใช้ซ้ำได้

<div grid="~ cols-2 gap-4">
<div>

```vue
<!-- Counter.vue -->
<template>
  <div class="text-center">
    <button 
      @click="increment"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
    >
      Count: {{ count }}
    </button>
    <p class="text-sm mt-2">ค่าปัจจุบัน: {{ count }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
```

</div>
<div class="flex items-center justify-center">
  <CounterDemo />
</div>
</div>

<!-- Component Definition -->
<script setup>
import { ref } from 'vue'

const CounterDemo = {
  template: `
    <div class="text-center p-4 border rounded-lg bg-gray-800/50">
      <button 
        @click="increment"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
      >
        Count: {{ count }}
      </button>
      <p class="text-sm mt-2">ค่าปัจจุบัน: {{ count }}</p>
    </div>
  `,
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    return { count, increment }
  }
}
</script>

---

# Directives

Directives คือคำสั่งพิเศษที่ขึ้นต้นด้วย v-

<div grid="~ cols-2 gap-4">
<div>

```vue
<!-- v-if/v-else -->
<div v-if="show">
  สวัสดี!
</div>
<div v-else>
  ลาก่อน!
</div>

<!-- v-for -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>
```

</div>
<div>

```vue
<!-- v-model -->
<input v-model="message" 
  placeholder="พิมพ์ข้อความ">

<!-- v-bind -->
<img :src="imageUrl" 
  :class="{ active: isActive }"
  class="w-20 h-20">
```

</div>
</div>

---

# Composition API

ทางเลือกใหม่สำหรับจัดการ logic ใน components

```js
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter() {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  return { count, double, increment }
}
```

---

# State Management (Pinia)

จัดการ state แบบ global

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

---

# Routing (Vue Router)

จัดการการนำทางใน SPA

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { 
    path: '/about', 
    component: () => import('../views/About.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

# Server-Side Rendering (Nuxt.js)

Framework สำหรับสร้าง Universal Vue Applications

```bash
# สร้างโปรเจคใหม่
npx nuxi init my-app

# เริ่มต้น development server
cd my-app
npm install
npm run dev
```

---

# Performance Tips

เทคนิคเพิ่มประสิทธิภาพ

<div grid="~ cols-2 gap-4">
<div>

```vue
<!-- ใช้ v-once -->
<template>
  <div v-once>{{ staticContent }}</div>
</template>

<!-- ใช้ v-memo -->
<div v-memo="[valueA, valueB]">
  {{ heavyComputation() }}
</div>
```

</div>
<div>

```vue
<!-- ใช้ shallowRef -->
<script setup>
import { shallowRef } from 'vue'

const largeObject = shallowRef({/* big object */})
</script>

<!-- Lazy components -->
<template>
  <Suspense>
    <component :is="lazyComponent" />
  </Suspense>
</template>
```

</div>
</div>

---

# Lifecycle Hooks

ติดตามวงจรชีวิตของ Component

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component is mounted')
  // โหลดข้อมูลจาก API
  fetchData()
})

onUpdated(() => {
  console.log('Component updated')
})

onUnmounted(() => {
  console.log('Component unmounted')
  // ทำความสะอาด timers, event listeners
})
</script>
```

---

# Composables

แยก logic ที่ใช้ซ้ำได้เป็น composable functions

```js
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

---

# Routing with Vue Router

จัดการเส้นทางในแอปพลิเคชัน

```js
// router.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

# Server-Side Rendering with Nuxt.js

สร้าง Universal Apps ด้วย Nuxt 3

```bash
# สร้างโปรเจคใหม่
npx nuxi@latest init my-app
```

คุณสมบัติหลัก:
- File-based routing
- Auto-imports
- Server routes
- API routes
- Built-in modules

---

# Testing Vue Applications

ทดสอบแอปพลิเคชันด้วย Vitest

```js
// Counter.spec.js
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter.vue', () => {
  it('increments counter on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('p').text()).toContain('1')
  })
})
```

---

# Performance Optimization

เทคนิคเพิ่มประสิทธิภาพ

```vue
<template>
  <div>
    <!-- Lazy load components -->
    <Suspense>
      <template #default>
        <LazyHeavyComponent />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>

    <!-- Virtual Scrolling -->
    <VirtualScroller :items="largeList" item-height="50" />
  </div>
</template>

<script setup>
// Lazy load components
const LazyHeavyComponent = defineAsyncComponent(
  () => import('./HeavyComponent.vue')
)

// Use v-memo for expensive re-renders
const largeList = ref([/* large data */])
</script>
```

---

# Deployment & CI/CD

ปรับใช้แอปพลิเคชันของคุณ

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run deploy
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
```

---

# Resources

แหล่งเรียนรู้เพิ่มเติม

- [Vue.js Documentation](https://vuejs.org/)
- [Vue Mastery](https://www.vuemastery.com/)
- [Vue School](https://vueschool.io/)
- [Vue.js Tips](https://vueschool.io/tips)
- [Vue.js Examples](https://vuejs.org/examples/)

---

# Q&A

## ขอบคุณที่เข้าร่วม workshop!


<div class="grid grid-cols-2 gap-4 mt-8">
  <div class="text-left">
    <h3 class="text-xl font-bold mb-2">ติดตามเราได้ที่</h3>
    <p>Twitter: @yourhandle</p>
    <p>GitHub: yourusername</p>
  </div>
  <div class="text-left">
    <h3 class="text-xl font-bold mb-2">Resources</h3>
    <p>Slides: your-slides-url</p>
    <p>Code: github.com/your/repo</p>
  </div>
</div>

<style>
.slidev-layout {
  @apply bg-gradient-to-br from-blue-900 to-indigo-900 text-white;
}

h1, h2, h3 {
  @apply text-white;
}

code {
  @apply bg-gray-800 text-green-300 px-2 py-1 rounded;
}

pre[class*="language-"] {
  @apply bg-gray-900 rounded-lg p-4 text-sm;
}
</style>
