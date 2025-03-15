import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import PictureBoard from '@/views/PictureBoard.vue'

// 由於使用了相對路徑作為基礎，這裡不需要 import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHashHistory(),
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
  ],
})

export default router
