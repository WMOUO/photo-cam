<template>
  <div class="w-screen h-screen flex flex-col items-center bg-gray-100">
    <div class="flex w-full items-center relative px-4 py-2">
      <n-button @click="goBack" quaternary class="absolute px-4 py-2 left-0">
        <template #icon>
          <n-icon size="56">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                d="M15.61 7.41L14.2 6l-6 6l6 6l1.41-1.41L11.03 12l4.58-4.59z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
      <h1 class="text-3xl font-bold mx-auto">photo</h1>
    </div>
    <div class="grid grid-cols-3 gap-4 p-4 w-full max-w-4xl">
      <div v-for="(photo, index) in photos" :key="index" class="relative">
        <img :src="photo" class="w-full h-auto rounded-lg shadow-md" />
      </div>
    </div>
    <div class="flex gap-4 mt-4 absolute bottom-4 right-4">
      <n-button @click="imageClear()" quaternary class="px-4 py-2">
        <template #icon>
          <n-icon size="36">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              enable-background="new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <g>
                  <path
                    d="M133.1,128l23.6,290.7c0,16.2,13.1,29.3,29.3,29.3h141c16.2,0,29.3-13.1,29.3-29.3L379.6,128H133.1z M194.7,393L188,160
            h18.5l6.9,233H194.7z M265,393h-18V160h18V393z M317.3,393h-18.6l6.8-233H324L317.3,393z"
                  ></path>
                </g>
                <path
                  d="M364,92h-36l-26.3-23c-3.7-3.2-8.4-5-13.2-5h-64.8c-4.9,0-9.7,1.8-13.4,5L184,92h-36c-17.6,0-30,8.4-30,26h276
          C394,100.4,381.6,92,364,92z"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
      </n-button>
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
