<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MenuDropdown from '@components/menu-dropdown.vue'
import { MenuItem } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'
import { type FileEntry } from '@tauri-apps/api/fs'

defineProps<{ entry: FileEntry; checked: boolean }>()
defineEmits<{
  (e: 'selected', v: FileEntry): void
  (e: 'remove', v: FileEntry): void
}>()

const { t } = useI18n()
</script>

<template>
  <tr>
    <td>
      <input type="checkbox" :checked="checked" @change="$emit('selected', entry)" />
    </td>
    <td>{{ entry.name }}</td>
    <td>
      {{ entry.path }}
    </td>
    <td>
      <menu-dropdown>
        <template #button>
          <ellipsis-horizontal-icon class="inline-block h-5 w-5" />
        </template>
        <template #default>
          <div class="p-1">
            <menu-item as="div">
              <button type="button" class="menu-item" @click="$emit('remove', entry)">
                {{ t('action.remove') }}
              </button>
            </menu-item>
          </div>
        </template>
      </menu-dropdown>
    </td>
  </tr>
</template>
