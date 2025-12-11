<script setup lang="ts">
// AI page content
const prompt = ref("");
const aiFeatures = [
	{
		icon: "i-carbon-chat",
		title: "AI Chat",
		desc: "สนทนากับ AI เพื่อขอความช่วยเหลือ",
	},
	{
		icon: "i-carbon-text-mining",
		title: "Content Generator",
		desc: "สร้างเนื้อหาเว็บไซต์อัตโนมัติ",
	},
	{
		icon: "i-carbon-image-search",
		title: "Image Generator",
		desc: "สร้างภาพจากข้อความ",
	},
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl font-bold">AI Tools</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="(feature, index) in aiFeatures" :key="index" 
           class="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <div class="flex items-center gap-3">
          <div :class="feature.icon" class="text-xl" />
          <h3 class="font-medium">{{ feature.title }}</h3>
        </div>
        <p class="text-sm text-gray-600 mt-2">{{ feature.desc }}</p>
      </div>
    </div>
    
    <div class="mt-6">
      <div class="flex items-center gap-2">
        <input 
          v-model="prompt"
          placeholder="Ask AI anything..."
          class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <div class="i-carbon-send" />
        </button>
      </div>
    </div>
  </div>
</template>
