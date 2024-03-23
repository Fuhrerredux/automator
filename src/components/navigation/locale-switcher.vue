<script lang="ts">
import useSettingsStore from '@/stores/settings'
import Dropdown from '@components/dropdown.vue'
import getLanguageName from '@shared/core/locale'

export default {
  name: 'LocaleSwitcher',
  components: { Dropdown },
  methods: {
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
    localeOptions() {
      return this.$i18n.availableLocales.map((locale) => ({
        value: locale,
        label: getLanguageName(locale)
      }))
    },
    currentLanguage() {
      return this.localeOptions.find((e) => e.value === this.getDefaultLanguage())
    }
  }
}
</script>

<template>
  <div class="locale-changer w-32">
    <dropdown
      localise
      :options="localeOptions"
      :model-value="currentLanguage?.value"
      display-key="label"
      value-key="value"
      @update:model-value="updateLanguage($event)" />
  </div>
</template>
