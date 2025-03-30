import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import PictureBoard from '@/views/PictureBoard.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/pictureBoard',
      name: 'board',
      component: PictureBoard,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  const token = localStorage.getItem('token')
  if (!token) return next('/login')

  try {
    const res = await fetch('https://upload-worker.5316eictlws-2.workers.dev/api/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      next()
    } else {
      localStorage.removeItem('token')
      next('/login')
    }
  } catch (err) {
    console.error('驗證失敗', err)
    localStorage.removeItem('token')
    next('/login')
  }
})

export default router
