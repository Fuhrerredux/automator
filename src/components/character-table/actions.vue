<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MenuDropdown from '@components/menu-dropdown.vue'
import { MenuItem } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'

defineProps<{
  character: CharacterWithId
  onUpdate: (character: CharacterWithId) => void
  onRemove: (character: CharacterWithId) => void
}>()

const { t } = useI18n()
</script>

<template>
  <menu-dropdown>
    <template #button>
      <ellipsis-horizontal-icon class="inline-block h-5 w-5" />
    </template>
    <template #default>
      <div class="p-1">
        <menu-item>
          <button type="button" class="menu-item" @click="onUpdate(character)">
            {{ t('action.edit') }}
          </button>
        </menu-item>
        <menu-item as="div">
          <button type="button" class="menu-item" @click="onRemove(character)">
            {{ t('action.remove') }}
          </button>
        </menu-item>
      </div>
    </template>
  </menu-dropdown>
</template>
