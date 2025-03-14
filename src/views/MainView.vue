<template>
  <div class="relative w-screen h-screen flex flex-col items-center justify-center">
    <input
      type="text"
      v-model="content"
      class="absolute top-4 z-10 w-1/3 px-4 py-2 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="輸入文字..."
    />
    <video
      ref="video"
      class="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
      autoplay
    ></video>
    <canvas ref="canvas" class="hidden"></canvas>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-white text-6xl font-bold bg-opacity-50 px-4 py-2">
        {{ content }}
      </span>
    </div>
    <button
      @click="capturePhoto"
      class="absolute top-4 right-4 z-10 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
    >
      拍照並下載
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const content = ref<string>('')

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
})

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
  context.fillText(content.value, canvas.value.width / 2, canvas.value.height / 2)

  const imageUrl: string = canvas.value.toDataURL('image/png')
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
</script>
