<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { FolderIcon } from '@heroicons/vue/24/outline'
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
      <button type="button" class="button-primary flex items-center" @click="browse">
        <folder-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.browse') }}</span>
      </button>
    </div>
  </label>
</template>
