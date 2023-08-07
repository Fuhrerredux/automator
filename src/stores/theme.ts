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
      this.change(this.theme)
    },
    change(theme: Theme) {
      this.theme = theme
      if (
        this.theme === 'dark' ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches && this.theme === 'auto')
      )
        document.body.classList.add('dark')
      else document.body.classList.remove('dark')
      localStorage.setItem('theme', theme)
    }
  }
})
export default useThemeStore
