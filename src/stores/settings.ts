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
    togglePositionPrevention() {
      this.$state.positionPrevention = !this.$state.positionPrevention
      this.save()
    },
    updatePositionPrevention(value: boolean) {
      this.$state.positionPrevention = value
      this.save()
    },
    getPositionPrevention(): boolean {
      return this.$state.positionPrevention
    },
    toggleOptionLogging() {
      this.$state.optionLogging = !this.$state.optionLogging
      this.save()
    },
    updateOptionLogging(value: boolean) {
      this.$state.optionLogging = value
      this.save()
    },
    getOptionLogging(): boolean {
      return this.$state.optionLogging
    },
    setLanguage(language: string) {
      this.$state.language = language
      this.save()
    },
    getLanguage(): string {
      return this.$state.language
    },
    getCustomConfig(): boolean {
      return this.$state.customConfig
    },
    toggleCustomConfig() {
      this.$state.customConfig = !this.$state.customConfig
      this.save()
    },
    updateCustomConfig(value: boolean) {
      this.$state.customConfig = value
      this.save()
    },
    updatePreference<T extends string | number | boolean>(
      key: keyof Automator.Preference,
      data: T
    ) {
      this.$state = { ...this.$state, [key]: data }
    },
    getPreference(key: keyof Automator.Preference) {
      return this.$state[key]
    }
    // TODO improve generic function for mutation; remove for now
  }
})
export default useSettingsStore
