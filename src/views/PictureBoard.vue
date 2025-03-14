<template>
  <div class="w-screen h-screen flex flex-col items-center bg-gray-100">
    <h1 class="text-3xl font-bold mt-4">拍攝相簿</h1>
    <div class="grid grid-cols-3 gap-4 p-4 w-full max-w-4xl">
      <div v-for="(photo, index) in photos" :key="index" class="relative">
        <img :src="photo" class="w-full h-auto rounded-lg shadow-md" />
      </div>
    </div>
    <div class="flex gap-4 mt-4">
      <button
        @click="goBack"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        返回拍照頁面
      </button>
      <button
        @click="showConfirmDialog = true"
        class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        清空相簿
      </button>
    </div>

    <div
      v-if="showConfirmDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p class="text-lg font-bold mb-4">確定要清空相簿嗎？</p>
        <div class="flex justify-center gap-4">
          <button
            @click="clearGallery"
            class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            確定
          </button>
          <button
            @click="showConfirmDialog = false"
            class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const photos = ref<string[]>([])
const router = useRouter()
const showConfirmDialog = ref(false)

onMounted(() => {
  const storedPhotos = localStorage.getItem('capturedPhotos')
  if (storedPhotos) {
    photos.value = JSON.parse(storedPhotos)
  }
})

const goBack = () => {
  router.push('/')
}

const clearGallery = () => {
  localStorage.removeItem('capturedPhotos')
  photos.value = []
  showConfirmDialog.value = false
}
</script>
