<script setup lang="ts">
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CharacterTable from '@/components/character-table/table.vue'
import CharacterEditor from '@components/character-editor.vue'
import { PlusIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n()
const editor = ref(false)
const characters = inject<CharacterWithId[]>('characters') ?? []

const openEditor = () => (editor.value = true)
const closeEditor = () => (editor.value = false)
</script>

<template>
  <main class="page">
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.characters') }}</h1>
      <button type="button" class="button-primary flex items-center" v-on:click="openEditor">
        <plus-icon class="mr-2 h-5 w-5" />
        <span>{{ t('action.create') }}</span>
      </button>
    </div>
    <div class="mt-4">
      <character-table :characters="characters" />
    </div>
  </main>
  <character-editor :open="editor" @hide="closeEditor" />
</template>
