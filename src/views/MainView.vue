<template>
  <div class="relative w-screen h-screen flex flex-col items-center justify-center">
    <video
      ref="video"
      class="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
      autoplay
    ></video>
    <canvas ref="canvas" class="hidden"></canvas>
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- To{ input } -->
      <div class="inline-flex items-center text-white text-6xl font-bold">
        <span>To[</span>
        <input
          type="text"
          v-model="content"
          class="bg-transparent border-none focus:outline-none text-white font-bold text-6xl text-center p-0 m-0 w-auto min-w-[2ch] tracking-normal"
          @input="adjustWidth"
          ref="inputEl"
        />

        <span>]</span>
      </div>
    </div>
    <div class="absolute top-4 right-4 z-10 flex gap-2">
      <n-button @click="goToGallery" quaternary class="px-4 py-2 rounded-lg">
        <template #icon>
          <n-icon size="60" color="#FFFFFF">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 16 16"
            >
              <g fill="none">
                <path
                  d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75zm0 4A.75.75 0 0 1 2.75 7h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.75zm0 4a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
        </template>
      </n-button>
    </div>
    <div class="absolute bottom-4 mid z-10 flex gap-2">
      <n-button quaternary round @click="capturePhoto" class="px-4 py-2 rounded-lg shadow">
        <template #icon>
          <n-icon size="60" color="#FFFFFF">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
            >
              <circle cx="16" cy="16" r="10" fill="currentColor"></circle>
              <path
                d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const content = ref<string>('') // 預設為空，但會被 To{} 包住
const inputEl = ref<HTMLInputElement | null>(null)
const photos = ref<string[]>([])
const router = useRouter()

onMounted(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (video.value) {
          video.value.srcObject = stream
        }
      })
      .catch((error) => {
        console.error('無法獲取攝影機視訊: ', error)
      })
  }
  adjustWidth()
})

// 動態調整 input 的寬度
const adjustWidth = () => {
  nextTick(() => {
    if (inputEl.value) {
      // 計算中文字與英文字的長度
      const textLength = content.value.length
      const chineseCount = (content.value.match(/[\u4e00-\u9fa5]/g) || []).length
      const englishCount = textLength - chineseCount

      // 英文 = 1 單位，中文字 = 2 單位
      const newWidth = englishCount * 1.2 + chineseCount * 2

      inputEl.value.style.width = `${Math.max(2, newWidth)}ch`
    }
  })
}

const capturePhoto = (): void => {
  if (!video.value || !canvas.value) return
  const context = canvas.value.getContext('2d')
  if (!context) return
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight

  // 反轉影像
  context.save()
  context.translate(canvas.value.width, 0)
  context.scale(-1, 1)
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  context.restore()

  // 計算文字位置，使其置中
  context.font = '48px Arial'
  context.fillStyle = 'white'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(`To{${content.value}}`, canvas.value.width / 2, canvas.value.height / 2)

  const imageUrl: string = canvas.value.toDataURL('image/png')
  photos.value.push(imageUrl)
  localStorage.setItem('capturedPhotos', JSON.stringify(photos.value))
  downloadImage(imageUrl)
}

const downloadImage = (dataUrl: string): void => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `captured_image_${new Date().getTime()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const goToGallery = () => {
  router.push('/pictureBoard')
}
</script>
