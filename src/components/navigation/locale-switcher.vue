<script lang="ts">
import useSettingsStore from '@/stores/settings'
import Dropdown from '@components/dropdown.vue'
import getLanguageName from '@shared/core/locale'

export default {
  name: 'LocaleSwitcher',
  components: { Dropdown },
  methods: {
    getLanguageName,
    getDefaultLanguage() {
      const savedLang = useSettingsStore().getLanguage()
      return savedLang || 'en'
    },
    updateLanguage(newLang: string) {
      useSettingsStore().setLanguage(newLang)
      this.$i18n.locale = newLang
    }
  },
  computed: {
    languageOptions() {
      return this.$i18n.availableLocales.map((e) => ({ value: e, label: getLanguageName(e) }))
    },
    currentLanguage() {
      return this.languageOptions.find((e) => e.value === this.getDefaultLanguage())
    }
  }
}
</script>

<template>
  <div class="locale-changer w-32">
    <dropdown
      :options="languageOptions"
      :model-value="currentLanguage"
      @update:model-value="updateLanguage($event.value)" />
  </div>
</template>
