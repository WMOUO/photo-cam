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

    <!-- 新增：選擇本地圖片 -->
    <input type="file" accept="image/*" multiple @change="handleFileUpload" class="mb-4" />

    <div class="grid grid-cols-3 gap-4 p-4 w-full max-w-4xl">
      <div v-for="(photo, index) in photos" :key="index" class="relative">
        <img :src="photo" class="w-full h-auto rounded-lg shadow-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const photos = ref<string[]>([])
const router = useRouter()

const goBack = () => {
  router.push('/')
}

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  photos.value = []
  for (const file of Array.from(files)) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        photos.value.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
input[type='file'] {
  margin-top: 8px;
}
</style>
