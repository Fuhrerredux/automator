<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import Navigation from '@components/navigation.vue'
import useTheme from '@composables/use-theme'
import DatabaseController from '@database/controller'
import useCharactersStore from '@stores/characters'
import useModStore from '@stores/mod'
import useTraitsStore from '@stores/traits'

const { t } = useI18n()
const $toast = useToast()
const database = DatabaseController.getInstance()
const characterStore = useCharactersStore()
const modStore = useModStore()
const traitsStore = useTraitsStore()

onMounted(async () => {
  await database.init()
  characterStore.refresh()

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

const { theme, change } = useTheme()
provide('theme', { theme, change })
</script>

<template>
  <navigation />
  <div class="content px-8">
    <router-view />
  </div>
</template>
