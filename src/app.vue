<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import useConfiguration from '@/stores/config'
import useCharactersStore from '@stores/characters'
import useModStore from '@stores/mod'
import useSettingsStore from '@stores/settings'
import useThemeStore from '@stores/theme'
import useTraitsStore from '@stores/traits'
import useFocusStore from './stores/focuses'

const { t } = useI18n()
const $toast = useToast()
const characterStore = useCharactersStore()
const modStore = useModStore()
const themeStore = useThemeStore()
const traitsStore = useTraitsStore()
const settingsStore = useSettingsStore()
const configStore = useConfiguration()
const focusStore = useFocusStore()

onMounted(async () => {
  characterStore.refresh()
  focusStore.refresh()

  themeStore.fetch()
  settingsStore.fetch()

  const directory = localStorage.getItem('directory')
  if (directory) {
    modStore.$patch({ directory })
    try {
      await modStore.readEntries(directory)
      const traitsDir = modStore.getCommonDirectory
      if (traitsDir) {
        await traitsStore.readDir(traitsDir.path)
        await traitsStore.fetchFromLocalStorage(configStore.config)
      }
    } catch {
      $toast.error(t('error.generic-dir-read'))
    }
  }
  configStore.import() // last so it doesnt fire unneeded errors
})
</script>

<template>
  <router-view />
</template>
@/database/character
@/database/focus
@/database/node