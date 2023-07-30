<script setup lang="ts">
import { type Ref, inject, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import writeCharacter from '@/shared/core/writer'
import CharacterEditor from '@components/character-editor.vue'
import CharacterTable from '@components/character-table/table.vue'
import RemoveCharacter from '@components/remove-character.vue'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { BaseDirectory, writeFile } from '@tauri-apps/api/fs'

const { t } = useI18n()
const editor = ref(false)
const confirm = ref(false)
const character = ref<CharacterWithId | null>(null)
const { characters, refresh } = inject<{
  characters: Ref<CharacterWithId[]>
  refresh: () => Promise<void>
}>('characters') ?? { characters: [], refresh: () => Promise.resolve() }

function handleNew() {
  character.value = null
  editor.value = true
}
function handleUpdate(char: CharacterWithId) {
  character.value = char
  editor.value = true
}
function handleEditorDismiss() {
  editor.value = false
}

function handleRemove(char: CharacterWithId) {
  character.value = char
  confirm.value = true
}
function handleConfirmDismiss() {
  confirm.value = false
}

async function exportCharacters() {
  const data = toRaw(characters.value)

  if (Array.isArray(data)) {
    const content = writeCharacter(data)
    const template = `characters = {
${content}
}`
    await writeFile('USA.txt', template, { dir: BaseDirectory.Document })
  }
}
</script>

<template>
  <main class="page">
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.characters') }}</h1>
      <div class="flex items-center gap-2">
        <button type="button" class="button-primary flex items-center" @click="handleNew">
          <plus-icon class="mr-2 h-5 w-5" />
          <span>{{ t('action.create') }}</span>
        </button>
        <button type="button" class="button-primary" @click="exportCharacters">Export</button>
      </div>
    </div>
    <div class="mt-4">
      <character-table :characters="characters" @update="handleUpdate" @remove="handleRemove" />
    </div>
  </main>
  <character-editor
    v-if="editor"
    :open="editor"
    :character="character"
    :refresh="refresh"
    @hide="handleEditorDismiss" />
  <remove-character
    :open="confirm"
    :character="character!"
    :refresh="refresh"
    @hide="handleConfirmDismiss" />
</template>
