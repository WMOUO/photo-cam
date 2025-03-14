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
        @click="imageClear()"
        class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        清空相簿
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog } from 'naive-ui'
const dialog = useDialog()

const photos = ref<string[]>([])
const router = useRouter()

onMounted(() => {
  const storedPhotos = localStorage.getItem('capturedPhotos')
  if (storedPhotos) {
    photos.value = JSON.parse(storedPhotos)
  }
})

const goBack = () => {
  router.push('/')
}

const imageClear = () => {
  dialog.warning({
    title: '刪除相簿內容',
    content: '確認要刪除相簿內容嗎？',
    positiveText: '確定',
    negativeText: '取消',
    bordered: true,
    positiveButtonProps: {
      size: 'large', // 讓按鈕變大
    },
    negativeButtonProps: {
      size: 'large', // 讓按鈕變大
    },
    onPositiveClick: () => {
      console.log('刪除成功')
      clearGallery()
    },
    onNegativeClick: () => {
      console.log('取消')
    },
  })
}

const clearGallery = () => {
  localStorage.removeItem('capturedPhotos')
  photos.value = []
}
</script>
