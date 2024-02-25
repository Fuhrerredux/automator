import { defineStore } from 'pinia'

const useThemeStore = defineStore({
  id: 'theme',
  state: () => ({
    theme: 'dark' as UserInterface.Theme
  }),
  getters: {
    isDarkTheme(): boolean {
      return this.theme === 'dark'
    }
  },
  actions: {
    fetch() {
      const themeFromLocalStorage = localStorage.getItem('theme') as UserInterface.Theme
      if (!themeFromLocalStorage) {
        const autoTheme = this.shouldUseAutoTheme()
        this.change(autoTheme)
      } else {
        this.change(themeFromLocalStorage)
      }
    },
    change(theme: UserInterface.Theme) {
      this.theme = theme

      const isDarkMode = this.theme === 'dark'
      document.body.classList.toggle('dark', isDarkMode)
      localStorage.setItem('theme', theme)
    },
    shouldUseAutoTheme(): UserInterface.Theme {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      const autoTheme = prefersDarkMode ? 'dark' : 'light'
      return autoTheme
    }
  }
})

export default useThemeStore
