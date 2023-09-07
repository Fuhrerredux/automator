import { createRouter, createWebHistory } from 'vue-router'
import CharactersPage from '@pages/characters.vue'
import ImportCharacters from '@pages/characters/import.vue'
import MainPage from '@pages/main.vue'
import OthersPage from '@pages/others.vue'
import AnalyzePage from '@pages/others/analyze.vue'
import OptimizePage from '@pages/others/optimize.vue'

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
  },
  {
    path: '/import',
    name: 'Import Characters',
    component: ImportCharacters
  },
  {
    path: '/optimize',
    name: 'Optimize',
    component: OptimizePage
  },
  {
    path: '/analyze',
    name: 'Analyze',
    component: AnalyzePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
