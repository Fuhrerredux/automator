import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@pages/main.vue'
import CharactersPage from '@pages/characters.vue'
import OthersPage from '@pages/others.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage
  },
  {
    path: '/characters',
    name: 'Characters',
    component: CharactersPage
  },
  {
    path: '/others',
    name: 'Others',
    component: OthersPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
