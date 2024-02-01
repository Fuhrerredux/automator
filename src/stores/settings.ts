import { defineStore } from 'pinia'

interface AppSettings {
    positionPrevention: boolean;
    language: string;
}

const useSettingsStore = defineStore({
    id: 'settings',
    state: (): AppSettings => {
        return {
            positionPrevention: false,
            language: 'en',
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
        setLanguage(language: string) {
            this.$state.language = language;
            this.save();
        },
        getLanguage(): string {
            return this.$state.language;
        },      
    },
});
export default useSettingsStore;