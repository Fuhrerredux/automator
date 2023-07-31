import { defineStore } from 'pinia'

const useThemeStore = defineStore({
  id: 'theme',
  state: () => {
    return {
      theme: 'auto'
    } as { theme: Theme }
  },
  actions: {
    fetch() {
      this.theme = localStorage.getItem('theme') as Theme
    },
    change(theme: Theme) {
      this.theme = theme
      if (this.theme === 'dark') document.body.classList.add('dark')
      else document.body.classList.remove('dark')
      localStorage.setItem('theme', theme)
    }
  }
})
export default useThemeStore
