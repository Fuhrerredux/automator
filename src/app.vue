<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import useCharactersStore from '@stores/characters'
import useModStore from '@stores/mod'
import useThemeStore from '@stores/theme'
import useTraitsStore from '@stores/traits'
import useSettingsStore from '@stores/settings'
import useCustomConfig from '@/stores/config'

const { t } = useI18n()
const $toast = useToast()
const characterStore = useCharactersStore()
const modStore = useModStore()
const themeStore = useThemeStore()
const traitsStore = useTraitsStore()
const settingsStore = useSettingsStore()
const configStore = useCustomConfig()

onMounted(async () => {
  characterStore.refresh()

  themeStore.fetch()
  settingsStore.fetch()
  configStore.import()

  const directory = localStorage.getItem('directory')
  if (directory) {
    modStore.$patch({ directory })
    try {
      await modStore.readEntries(directory)
      const traitsDir = modStore.getCommonDirectory
      if (traitsDir) {
        await traitsStore.readDir(traitsDir.path)
        await traitsStore.fetchFromLocalStorage()
      }
    } catch {
      $toast.error(t('error.generic-dir-read'))
    }
  }
})
</script>

<template>
  <router-view />
</template>
@/database/character