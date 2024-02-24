import { defineStore } from 'pinia'

const useSettingsStore = defineStore({
  id: 'settings',
  state: (): Automator.Preference => {
    return {
      customConfig: false,
      positionPrevention: false,
      optionLogging: true,
      language: 'en',
      predefinedConfiguration: null
    }
  },
  actions: {
    fetch() {
      const storedSettings = localStorage.getItem('app_settings')
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings)
        this.$state = { ...this.$state, ...parsedSettings }
      }
    },
    save() {
      localStorage.setItem('app_settings', JSON.stringify(this.$state))
    },
    setLanguage(language: string) {
      this.$state.language = language
      this.save()
    },
    getLanguage(): string {
      return this.$state.language
    },
    updatePreference<T extends string | number | boolean>(
      key: keyof Automator.Preference,
      data: T
    ) {
      this.$state = { ...this.$state, [key]: data }
      this.save()
    },
    getPreference<T extends keyof Automator.Preference>(
      key: T
    ): Automator.Preference[T] {
      return this.$state[key]
    },
    // TODO improve generic function for mutation; remove for now
  }
})
export default useSettingsStore
