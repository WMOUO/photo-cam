import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import PictureBoard from '@/views/PictureBoard.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
