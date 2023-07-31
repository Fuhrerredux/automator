<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ExclamationTriangleIcon, FolderIcon } from '@heroicons/vue/24/outline'
import useModStore from '@stores/mod'
import { open } from '@tauri-apps/api/dialog'

const store = useModStore()
const { t } = useI18n()

async function browse() {
  const directory = await open({
    directory: true
  })
  if (directory && typeof directory === 'string') {
    store.$patch({ directory })
    localStorage.setItem('directory', directory)
  }
}
</script>

<template>
  <div
    v-if="store.directory.length <= 0"
    class="mx-auto w-1/2 text-sm text-center bg-amber-100 dark:bg-amber-500 dark:text-amber-800 font-medium p-4 rounded-md">
    <exclamation-triangle-icon class="h-6 w-6 inline-block" />
    <p>{{ t('error.no-dir') }}</p>
  </div>
  <label for="directory" class="block">
    <span class="form-label">{{ t('field.mod-dir') }}</span>
    <div class="flex items-center gap-4">
      <input
        disabled
        type="text"
        name="directory"
        id="directory"
        class="form-input"
        v-model="store.directory" />
      <button type="button" class="button-primary flex items-center shrink-0" @click="browse">
        <folder-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.browse') }}</span>
      </button>
    </div>
  </label>
</template>
