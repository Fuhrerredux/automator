<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import SpinnerButton from '@components/spinner-button.vue'
import { type FileEntry, removeFile } from '@tauri-apps/api/fs'
import EntryRow from './row.vue'

const props = defineProps<{ entries: FileEntry[] }>()

const { t } = useI18n()
const loading = ref(false)
const selected = ref<string[]>([])
const $toast = useToast()

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
  return await removeFile(file.path)
}

async function removeAll() {
  try {
    loading.value = true
    const promises = selected.value.map((e) => removeFile(e))
    await Promise.all(promises)

    $toast.success(t('status.file-removed'))
  } catch (e) {
    $toast.error(String(e))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-end">
      <spinner-button type="button" class="button-primary" :loading="loading" @click="removeAll">
        <template #content>
          {{ t('action.purge') }}
        </template>
        <template #loading>
          <span>{{ t('loading.purging') }}</span>
        </template>
      </spinner-button>
    </div>
    <table>
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
</template>
