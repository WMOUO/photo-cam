<template>
  <div class="relative w-screen h-screen flex flex-col items-center justify-center">
    <div v-if="!isFullScreen" class="absolute top-4 left-4 z-10">
      <n-button @click="requestFullScreen" quaternary class="px-4 py-2 rounded-lg">
        <template #icon>
          <n-icon size="40" color="#FFFFFF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M320 96h96v96h-48v-48h-48V96zM96 320h48v48h48v48H96v-96zm48-176H96v96h48v-48h48v-48H144zm272 176h-48v48h-48v48h96v-96z"
                fill="currentColor"
              />
            </svg>
          </n-icon>
        </template>
      </n-button>
    </div>

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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256z"
                  fill="currentColor"
                />
              </svg>
            </n-icon>
          </template>
        </n-button>
        <n-button type="primary" quaternary @click="confirmPrint">
          <template #icon>
            <n-icon size="45" color="#02C874">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256S119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                  fill="currentColor"
                />
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
              />
            </svg>
          </n-icon>
        </template>
      </n-button>
    </div>

    <div class="absolute bottom-4 mid z-10 flex gap-2">
      <n-button
        quaternary
        round
        @click="capturePhoto"
        :disabled="isUploading"
        class="px-4 py-2 rounded-lg shadow"
      >
        <template #icon>
          <n-icon size="60" color="#FFFFFF">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="10" fill="currentColor" />
              <path
                d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4z"
                fill="currentColor"
              />
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
import { useNotification } from 'naive-ui'
import type { NotificationReactive } from 'naive-ui/es/notification/src/NotificationProvider'

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

const notification = useNotification()
const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const content = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const router = useRouter()
const isUploading = ref(false)
const isCameraReady = ref(false)
const isFullScreen = ref(false)

onMounted(() => {
  document.addEventListener('fullscreenchange', checkFullScreen)
  document.addEventListener('webkitfullscreenchange', checkFullScreen)
  document.addEventListener('mozfullscreenchange', checkFullScreen)
  document.addEventListener('MSFullscreenChange', checkFullScreen)
  checkFullScreen()

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

        // ✅ 等 metadata 載入後才開放拍照
        video.value.addEventListener('loadedmetadata', () => {
          console.log('[DEBUG] 視訊 metadata 載入完成')
          isCameraReady.value = true
        })
      }
    })
    .catch((err) => {
      console.error('❌ 無法獲取攝影機視訊:', err)
      notification.error({ title: '錯誤', content: '無法啟動攝影機' })
    })

  adjustWidth()
})

const checkFullScreen = () => {
  const doc = document as FullscreenDocument
  isFullScreen.value = !!(
    document.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  )
}

const requestFullScreen = () => {
  const el = document.documentElement as FullscreenElement

  if (el.requestFullscreen) {
    el.requestFullscreen()
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen()
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen()
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen()
  }
}

const adjustWidth = () => {
  nextTick(() => {
    if (!inputEl.value) return
    const chinese = (content.value.match(/[一-龥]/g) || []).length
    const total = content.value.length
    const width = Math.max(2, (total - chinese) * 1.2 + chinese * 2)
    inputEl.value.style.width = `${width}ch`
  })
}

const capturePhoto = async () => {
  console.log('[DEBUG] 開始拍照流程')

  if (!isCameraReady.value) {
    notification.warning({ title: '請稍候', content: '攝影機尚未準備好' })
    console.warn('[DEBUG] 攝影機未就緒，禁止拍照')
    return
  }

  if (isUploading.value) {
    console.warn('[DEBUG] 正在上傳中，略過此次拍照')
    return
  }
  isUploading.value = true

  if (!video.value || !canvas.value) {
    console.error('[DEBUG] video 或 canvas 尚未準備好')
    isUploading.value = false
    return
  }

  let imageUrl = ''
  try {
    const ctx = canvas.value.getContext('2d')
    if (!ctx) throw new Error('無法取得 canvas context')

    const width = video.value.videoWidth
    const height = video.value.videoHeight
    if (width === 0 || height === 0) throw new Error('攝影機尚未準備好')

    canvas.value.width = width
    canvas.value.height = height
    ctx.save()
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video.value, 0, 0, width, height)
    ctx.restore()

    ctx.font = '66px "Lexend", sans-serif'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`To[${content.value}]`, width / 2, height / 2)

    imageUrl = canvas.value.toDataURL('image/png', 0.8)
    previewUrl.value = imageUrl
  } catch (err) {
    console.error('❌ 製作圖片時發生錯誤', err)
    notification.error({ title: '拍照錯誤', content: `${err}` })
    isUploading.value = false
    return
  }

  const uploadNotify: NotificationReactive = notification.create({
    title: '圖片上傳中',
    content: '請稍候…',
    type: 'info',
    duration: 0,
  })

  const timeout = (ms = 10000) =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))

  try {
    const res = (await Promise.race([
      fetch('https://upload-worker.5316eictlws-2.workers.dev/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl }),
      }),
      timeout(),
    ])) as Response

    const data = await res.json()
    console.log('✅ 上傳成功', data)

    uploadNotify.destroy()
    notification.success({ title: '上傳成功', content: '圖片已成功上傳' })

    // ✅ 成功才下載
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `captured_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err: unknown) {
    console.error('❌ 上傳失敗', err)
    uploadNotify.destroy()
    const errorMessage = err instanceof Error ? err.message : '請稍後再試'
    notification.error({ title: '上傳失敗', content: errorMessage })
  } finally {
    isUploading.value = false
    console.log('[DEBUG] 上傳流程結束，isUploading = false')
  }
}

const closePreview = () => {
  previewUrl.value = ''
}

const confirmPrint = () => {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(
    `<!DOCTYPE html><html><head><style>@page{margin:0}body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;background:black}img{max-width:100vw;max-height:100vh;object-fit:contain}</style></head><body><img src="${previewUrl.value}" onload="window.print();window.close();"></body></html>`,
  )
  win.document.close()
  closePreview()
}

const goToGallery = () => {
  router.push('/pictureBoard')
}
</script>
