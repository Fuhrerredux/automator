import { defineStore } from 'pinia'

const useThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    theme: 'auto' as UserInterface.Theme
  }),
  actions: {
    fetch() {
      this.theme = localStorage.getItem('theme') as UserInterface.Theme
      this.change(this.theme)
    },
    change(theme: UserInterface.Theme) {
      this.theme = theme

      const isDarkMode =
      this.theme === 'dark' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches && this.theme === 'auto')
      document.body.classList.toggle('dark', isDarkMode)
      localStorage.setItem('theme', theme)
    }
  }
})

export default useThemeStore
