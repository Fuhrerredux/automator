<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MenuDropdown from '@components/menu-dropdown.vue'
import RolesViewer from '@components/roles-viewer.vue'
import { MenuItem } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'

defineProps<{ character: CharacterWithId }>()
defineEmits<{
  (e: 'update', value: CharacterWithId): void
  (e: 'remove', value: CharacterWithId): void
}>()

const { t } = useI18n()
</script>

<template>
  <tr>
    <td>{{ character.tag }}</td>
    <td>{{ character.name }}</td>
    <td>
      <roles-viewer :positions="character.advisorRoles ?? []" />
    </td>
    <td>
      <menu-dropdown>
        <template #button>
          <ellipsis-horizontal-icon class="inline-block h-5 w-5" />
        </template>
        <template #default>
          <div class="p-1">
            <menu-item>
              <button type="button" class="menu-item hidden" @click="$emit('update', character)">
                {{ t('action.edit') }}
              </button>
            </menu-item>
            <menu-item as="div">
              <button type="button" class="menu-item" @click="$emit('remove', character)">
                {{ t('action.remove') }}
              </button>
            </menu-item>
          </div>
        </template>
      </menu-dropdown>
    </td>
  </tr>
</template>
