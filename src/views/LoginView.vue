<!-- pages/LoginView.vue -->
<template>
  <div class="h-screen w-screen flex items-center justify-center bg-white">
    <div class="flex flex-col items-center gap-4">
      <input
        v-model="password"
        type="password"
        placeholder="輸入密碼"
        class="text-xl p-2 rounded border w-64 text-black"
      />
      <button @click="login" class="bg-green-500 text-white px-6 py-2 rounded">登入</button>
      <p class="text-red-500" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await fetch('https://upload-worker.5316eictlws-2.workers.dev/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value }),
    })
    if (!res.ok) throw new Error('密碼錯誤')
    const data = await res.json()
    localStorage.setItem('token', data.token)
    router.push('/')
  } catch (e) {
    console.log(e)
    error.value = '登入失敗：密碼錯誤'
  }
}
</script>
