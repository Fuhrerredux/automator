<script lang="ts">
import Dropdown from '@components/dropdown.vue'
import getLanguageName from '@shared/core/locale'
import useSettingsStore from '@/stores/settings';

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
      useSettingsStore().setLanguage(newLang);
      this.$i18n.locale = newLang;
    },
  }
}
</script>

<template>
  <div class="locale-changer w-32">
    <dropdown
      :options="$i18n.availableLocales"
      :model-value="getDefaultLanguage()"
      :display-key="(e: string) => getLanguageName(e)"
      :value-key="(e: string) => e"
      @update:model-value="(newLang: string) => updateLanguage(newLang)" />
  </div>
</template>
