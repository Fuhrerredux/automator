<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import RemovedOrphanedModal from '@components/optimize/remove-orphaned-modal.vue'
import Spinner from '@components/spinner.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { goals } from '@shared/const/sprites'
import useSpriteDefinitions from '@stores/definitions'
import useModStore from '@stores/mod'
import { type FileEntry, removeFile } from '@tauri-apps/api/fs'
import EntryRow from './row.vue'

const props = defineProps<{ entries: FileEntry[] }>()

const { t } = useI18n()
const toast = useToast()
const open = ref(false)
const loading = ref(false)
const selected = ref<string[]>([])
const modStore = useModStore()
const spriteDefinitionsStore = useSpriteDefinitions()

function handleCheckboxHeader(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selected.value = props.entries.map((e) => e.path)
  } else {
    selected.value = []
  }
}

function handleCheckbox(entry: FileEntry) {
  let updated = Array.from(selected.value)
  if (updated.find((e) => entry.path === e)) {
    updated = updated.filter((e) => e !== entry.path)
    selected.value = updated
  } else {
    updated.push(entry.path)
    selected.value = updated
  }
}

async function removeFileEntry(file: FileEntry) {
  const baseDir = modStore.directory
  loading.value = true
  try {
    await removeFile(file.path)
    await spriteDefinitionsStore.findOrphaned(baseDir, goals)

    open.value = false
  } catch (e) {
    toast.error(String(e))
  } finally {
    loading.value = false
  }
}

async function handleRemoveSuccess() {
  const baseDir = modStore.directory
  await spriteDefinitionsStore.findOrphaned(baseDir, goals)
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-end">
      <button
        type="button"
        class="button-primary flex items-center"
        :disabled="selected.length <= 0"
        @click="open = true">
        <trash-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.purge') }}</span>
      </button>
    </div>
    <div v-if="loading" class="flex items-center justify-center">
      <spinner class="h-6 w-6" />
    </div>
    <table v-else>
      <thead>
        <tr>
          <th scope="col">
            <span class="sr-only">{{ t('field.selected') }}</span>
            <input
              type="checkbox"
              name="header-checkbox"
              id="header-checkbox"
              @change="handleCheckboxHeader" />
          </th>
          <th scope="col" class="w-2/6">{{ t('field.file-name') }}</th>
          <th scope="col" class="w-4/6">{{ t('field.path') }}</th>
          <th scope="col" class="w-1/6">
            <span class="sr-only">{{ t('field.actions') }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="entry of entries" :key="entry.path">
          <entry-row
            :entry="entry"
            :checked="selected.includes(entry.path)"
            @remove="removeFileEntry"
            @selected="handleCheckbox" />
        </template>
      </tbody>
    </table>
  </div>
  <removed-orphaned-modal
    :open="open"
    :selected="selected"
    @hide="open = false"
    @success="handleRemoveSuccess" />
</template>
