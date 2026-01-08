

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
	layout: "dashboard",
});

const domains = ref([
	{ id: 1, name: "example.com", status: "active", expiryDate: "2025-12-31" },
	{ id: 2, name: "test.com", status: "pending", expiryDate: "2025-10-15" },
	{ id: 3, name: "demo.com", status: "expired", expiryDate: "2024-05-20" },
]);

const getStatusText = (status: string) => {
	const statusMap: Record<string, string> = {
		active: "ใช้งานได้",
		pending: "กำลังตรวจสอบ",
		expired: "หมดอายุ",
	};
	return statusMap[status] || status;
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("th-TH");
};
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold">จัดการโดเมน</h1>
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        เพิ่มโดเมนใหม่
      </button>
    </div>

    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex justify-between mb-4">
        <input 
          type="text" 
          placeholder="ค้นหาโดเมน..."
          class="border rounded px-3 py-2 w-64"
        />
        <select class="border rounded px-3 py-2">
          <option>ทั้งหมด</option>
          <option>ใช้งานได้</option>
          <option>กำลังตรวจสอบ</option>
          <option>หมดอายุ</option>
        </select>
      </div>

      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2">โดเมน</th>
            <th class="text-left py-2">สถานะ</th>
            <th class="text-left py-2">วันที่หมดอายุ</th>
            <th class="text-right py-2">การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="domain in domains" :key="domain.id" class="border-b hover:bg-gray-50">
            <td class="py-3">{{ domain.name }}</td>
            <td>
              <span 
                :class="{
                  'bg-green-100 text-green-800': domain.status === 'active',
                  'bg-yellow-100 text-yellow-800': domain.status === 'pending',
                  'bg-red-100 text-red-800': domain.status === 'expired'
                }"
                class="px-2 py-1 rounded-full text-xs"
              >
                {{ getStatusText(domain.status) }}
              </span>
            </td>
            <td>{{ formatDate(domain.expiryDate) }}</td>
            <td class="text-right">
              <button class="text-blue-500 hover:text-blue-700 mr-2">แก้ไข</button>
              <button class="text-red-500 hover:text-red-700">ลบ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>