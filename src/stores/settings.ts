import { defineStore } from 'pinia'

type AppSettings = {
  customConfig: boolean
  positionPrevention: boolean
  optionLogging: boolean
  language: string
  ideologiesType: number // instead of making 3 options, make one on which value is returned based on the number
}

const useSettingsStore = defineStore({
  id: 'settings',
  state: (): AppSettings => {
    return {
      customConfig: false,
      positionPrevention: false,
      optionLogging: true,
      language: 'en',
      ideologiesType: 0,
    };
  },
  actions: {
    fetch() {
      const storedSettings = localStorage.getItem('app_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        this.$state = { ...this.$state, ...parsedSettings };
      }
    },
    save() {
      localStorage.setItem('app_settings', JSON.stringify(this.$state))
    },
    togglePositionPrevention() {
      this.$state.positionPrevention = !this.$state.positionPrevention;
      this.save();    
    },
    updatePositionPrevention(value: boolean) {
      this.$state.positionPrevention = value;
      this.save();
    },
    getPositionPrevention(): boolean {
      return this.$state.positionPrevention;
    },
    toggleOptionLogging() {
      this.$state.optionLogging = !this.$state.optionLogging;
      this.save();
    },
    updateOptionLogging(value: boolean) {
      this.$state.optionLogging = value;
      this.save();
    },
    getOptionLogging(): boolean {
      return this.$state.optionLogging;
    },
    setLanguage(language: string) {
      this.$state.language = language;
      this.save();
    },
    getLanguage(): string {
      return this.$state.language;
    },
    getCustomConfig(): boolean {
      return this.$state.customConfig
    },
    toggleCustomConfig() {
      this.$state.customConfig = !this.$state.customConfig
      this.save()
    },
    updateCustomConfig(value:boolean) {
      this.$state.customConfig = value;
      this.save()
    },
    toggleSetting(setting: keyof AppSettings) {
      (this.$state[setting] as boolean) = !(this.$state[setting] as boolean);
      this.save();    
    },
    updateSetting(setting: keyof AppSettings, value: boolean) {
      (this.$state[setting] as boolean) = (value as boolean);
      this.save();
    },
    updateNumericalSetting(setting: keyof AppSettings, value: number) {
      (this.$state[setting] as number) = (value as number);
      this.save();
    },
    getSetting(setting: keyof AppSettings): boolean {
      return this.$state[setting] as boolean;
    },
    getNumericalSetting(setting: keyof AppSettings): number {
      return this.$state[setting] as number;
    },
  },
});
export default useSettingsStore;