<template>
  <div class="w-screen h-screen flex flex-col items-center bg-gray-100">
    <div class="flex w-full items-center relative px-4 py-2">
      <n-button @click="goBack" quaternary class="absolute px-4 py-2 left-0">
        <template #icon>
          <n-icon size="56">
            <svg viewBox="0 0 24 24">
              <path
                d="M15.61 7.41L14.2 6l-6 6l6 6l1.41-1.41L11.03 12l4.58-4.59z"
                fill="currentColor"
              />
            </svg>
          </n-icon>
        </template>
      </n-button>
      <h1 class="text-3xl font-bold mx-auto">photo</h1>
    </div>

    <div v-if="loading" class="mt-10 text-lg text-gray-600">載入中...</div>

    <div class="grid grid-cols-5 gap-2 p-4 w-full" v-else>
      <div v-for="(photo, index) in photos" :key="index" class="relative">
        <img :src="photo" class="w-full h-auto rounded-lg shadow-md" @error="onImageError(photo)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const photos = ref<string[]>([])
const loading = ref(true)
const router = useRouter()

const goBack = () => {
  router.push('/')
}

const onImageError = (url: string) => {
  console.warn('⚠️ 無法載入圖片：', url)
}

onMounted(async () => {
  try {
    const res = await fetch('https://upload-worker.5316eictlws-2.workers.dev/api/list')
    const data = await res.json()
    photos.value = data.files
    console.log('✅ 圖片清單：', data.files)
  } catch (error) {
    console.error('❌ 讀取圖片清單失敗', error)
  } finally {
    loading.value = false
  }
})
</script>
