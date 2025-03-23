<template>
  <div class="relative w-screen h-screen flex flex-col items-center justify-center">
    <div class="absolute inset-0 flex items-center justify-center overflow-hidden">
      <!-- 攝影機顯示區：拉滿整個寬高 -->
      <video
        ref="video"
        class="w-full h-full object-cover transform scale-x-[-1] bg-black"
        autoplay
        playsinline
        muted
      ></video>
    </div>

    <canvas ref="canvas" class="hidden"></canvas>

    <!-- 拍照後預覽圖 -->
    <div
      v-if="previewUrl"
      class="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-20"
    >
      <img :src="previewUrl" alt="preview" class="h-[90%] rounded shadow-lg" />
      <div class="mt-4 flex gap-4 w-1/3 justify-between">
        <n-button type="primary" @click="closePreview" quaternary>
          <template #icon>
            <n-icon size="56" color="#FF2D2D">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256z"
                  fill="currentColor"
                ></path>
              </svg>
            </n-icon>
          </template>
        </n-button>

        <n-button type="primary" quaternary @click="confirmPrint">
          <template #icon>
            <n-icon size="45" color="#02C874">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256S119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                  fill="currentColor"
                ></path>
              </svg>
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <div class="absolute inset-0 flex items-center justify-center">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path
                d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75zm0 4A.75.75 0 0 1 2.75 7h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.75zm0 4a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
        </template>
      </n-button>
    </div>

    <div class="absolute bottom-4 mid z-10 flex gap-2">
      <n-button quaternary round @click="capturePhoto" class="px-4 py-2 rounded-lg shadow">
        <template #icon>
          <n-icon size="60" color="#FFFFFF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
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
const content = ref<string>('')
const inputEl = ref<HTMLInputElement | null>(null)
const photos = ref<string[]>([])
const previewUrl = ref<string>('')
const router = useRouter()

onMounted(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
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

const adjustWidth = () => {
  nextTick(() => {
    if (inputEl.value) {
      const textLength = content.value.length
      const chineseCount = (content.value.match(/[一-龥]/g) || []).length
      const englishCount = textLength - chineseCount
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

  context.save()
  context.translate(canvas.value.width, 0)
  context.scale(-1, 1)
  context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  context.restore()

  context.font = '48px "Lexend", sans-serif'
  context.fillStyle = 'white'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(`To[${content.value}]`, canvas.value.width / 2, canvas.value.height / 2)

  const imageUrl: string = canvas.value.toDataURL('image/png')
  previewUrl.value = imageUrl
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

const closePreview = () => {
  previewUrl.value = ''
}

const confirmPrint = () => {
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(`
      <html>
        <head>
          <style>
            @page {
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: black;
            }
            img {
              max-width: 100vw;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${previewUrl.value}" onload="window.print(); window.close();">
        </body>
      </html>
    `)
    win.document.close()
  }
  closePreview()
}

const goToGallery = () => {
  router.push('/pictureBoard')
}
</script>
