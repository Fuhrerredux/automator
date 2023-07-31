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
import { exportCharacters } from '@shared/core/writer'
import useCharacterStore from '@stores/characters'
import useModStore from '@stores/mod'

const { t } = useI18n()
const $toast = useToast()
const editor = ref(false)
const confirm = ref(false)
const character = ref<CharacterWithId | null>(null)
const characterStore = useCharacterStore()
const modStore = useModStore()
const { characters } = storeToRefs(characterStore)
const { refresh } = characterStore

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

async function handleExportCharacters() {
  if (modStore.directory.length <= 0) {
    $toast.error(t('error.no-dir-selected'))
    return
  }

  const data = characterStore.characters
  const common = modStore.getCommonDirectory

  if (Array.isArray(data) && common) {
    await exportCharacters(data, common.path)
    $toast.success(t('status.characters-exported'))
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
        <menu-dropdown>
          <template #button>
            <ellipsis-vertical-icon class="inline-block h-5 w-5" />
          </template>
          <template #default>
            <div class="p-1">
              <menu-item as="div">
                <button type="button" class="menu-item" @click="handleExportCharacters">
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
