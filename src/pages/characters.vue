<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import CharacterTable from '@components/character-table/table.vue'
import ExportCharacters from '@components/characters/export-characters.vue'
import ImportCharacters from '@components/characters/import-characters.vue'
import PurgeCharacters from '@components/characters/purge-characters.vue'
import RemoveCharacter from '@components/characters/remove-character.vue'
import MenuDropdown from '@components/menu-dropdown.vue'
import Page from '@components/page.vue'
import { MenuItem } from '@headlessui/vue'
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EllipsisVerticalIcon,
  NoSymbolIcon,
  PlusIcon
} from '@heroicons/vue/20/solid'
import useCharacterStore from '@stores/characters'
import useModStore from '@stores/mod'

const { t } = useI18n()
const confirm = ref(false)
const purgeConfirm = ref(false)
const exportCharacters = ref(false)
const importCharacters = ref(false)
const characterRef = ref<CharacterWithId | null>(null)
const characterStore = useCharacterStore()
const modStore = useModStore()
const { characters } = storeToRefs(characterStore)
const { directory } = storeToRefs(modStore)
const { remove, purge } = characterStore

const onCreateCharacter = () => router.push('/edit')
const onUpdateCharacter = (character: CharacterWithId) =>
  router.push(`/edit?characterId=${character.id}`)
const onRemoveCharacter = (character: CharacterWithId) => {
  characterRef.value = character
  confirm.value = true
}
</script>

<template>
  <page>
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.characters') }}</h1>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="button-primary flex items-center"
          :disabled="directory.trim().length <= 0"
          @click="onCreateCharacter">
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
                <button type="button" class="menu-item" @click="exportCharacters = true">
                  <arrow-up-tray-icon class="h-5 w-5 mr-4" />
                  <span>{{ t('action.export') }}</span>
                </button>
              </menu-item>
              <menu-item as="div">
                <button type="button" class="menu-item hidden" @click="importCharacters = true">
                  <arrow-down-tray-icon class="h-5 w-5 mr-4" />
                  <span>{{ t('action.import') }}</span>
                </button>
              </menu-item>
            </div>
            <div class="p-1">
              <menu-item as="div">
                <button type="button" class="menu-item" @click="purgeConfirm = true">
                  <no-symbol-icon class="h-5 w-5 mr-4" />
                  <span>{{ t('action.purge') }}</span>
                </button>
              </menu-item>
            </div>
          </template>
        </menu-dropdown>
      </div>
    </div>
    <div class="mt-4 flex-1 flex flex-col">
      <character-table
        :characters="characters"
        @update="onUpdateCharacter"
        @remove="onRemoveCharacter" />
    </div>
  </page>
  <remove-character
    v-if="confirm"
    :open="confirm"
    :character="characterRef!"
    :remove-fn="remove"
    @hide="confirm = false" />
  <purge-characters :open="purgeConfirm" :purge-fn="purge" @hide="purgeConfirm = false" />
  <export-characters :open="exportCharacters" @hide="exportCharacters = false" />
  <import-characters :open="importCharacters" @hide="importCharacters = false" />
</template>
