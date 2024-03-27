<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import CharacterTable from '@components/character-table/table.vue'
import RemoveCharacter from '@components/characters/remove-character.vue'
import AppHeader from '@components/header.vue'
import SpinnerButton from '@components/spinner-button.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import useCharacterStore from '@stores/characters'
import useImportStore from '@stores/import'

const { t } = useI18n()
const $toast = useToast()
const characterStore = useCharacterStore()
const importStore = useImportStore()
const { characters } = storeToRefs(importStore)
const { importAll } = characterStore
const { remove } = importStore

const importing = ref(false)
const character = ref<CharacterWithId | null>(null)

const onCharacterImport = () => {
  importing.value = true
  try {
    importAll(importStore.characters)
    $toast.success(t('status.characters-imported'))
    router.back()
  } catch (e) {
    $toast.error(String(e))
  } finally {
    importing.value = false
  }
}

const onCharacterUpdate = (param: CharacterWithId) => {
  router.push(`/edit?characterId=${param.id}`)
}
const onCharacterRemove = (param: CharacterWithId) => {
  character.value = param
}
</script>

<template>
  <app-header title="route.character-import">
    <spinner-button
      type="button"
      class="button-primary flex items-center"
      :loading="importing"
      @click="onCharacterImport">
      <template #content>
        <check-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.import') }}</span>
      </template>
      <template #loading>
        <check-icon class="h-5 w-5 mr-2" />
        <span>{{ t('loading.importing') }}</span>
      </template>
    </spinner-button>
  </app-header>
  <main class="content px-8 page">
    <character-table
      :characters="characters"
      @update="onCharacterUpdate"
      @remove="onCharacterRemove" />
  </main>
  <remove-character
    v-if="character"
    :open="!!character"
    :character="character!"
    :remove-fn="remove"
    @hide="character = null" />
</template>
