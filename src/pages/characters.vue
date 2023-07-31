<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import CharacterEditor from '@components/character-editor.vue'
import CharacterTable from '@components/character-table/table.vue'
import MenuDropdown from '@components/menu-dropdown.vue'
import RemoveCharacter from '@components/remove-character.vue'
import { MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon, PlusIcon } from '@heroicons/vue/20/solid'
import writeCharacters from '@shared/core/writer'
import useCharacters from '@stores/characters'

const { t } = useI18n()
const $toast = useToast()
const editor = ref(false)
const confirm = ref(false)
const character = ref<CharacterWithId | null>(null)
const store = useCharacters()
const { characters } = storeToRefs(store)
const { refresh } = store

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
  const data = store.characters
  if (Array.isArray(data)) await writeCharacters(data)
  $toast.success(t('status.characters-exported'))
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
        <menu-dropdown>
          <template #button>
            <ellipsis-vertical-icon class="inline-block h-5 w-5" />
          </template>
          <template #default>
            <div class="p-1">
              <menu-item as="div">
                <button type="button" class="menu-item" @click="exportCharacters">
                  {{ t('action.export') }}
                </button>
              </menu-item>
            </div>
          </template>
        </menu-dropdown>
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
