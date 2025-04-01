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

export default router
