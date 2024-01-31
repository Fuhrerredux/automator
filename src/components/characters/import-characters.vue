<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import DropZone from '@components/drop-zone.vue'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { readCharacterFile, readLocalisationFile } from '@shared/core/reader'
import { readFileObject } from '@shared/utils/reader'
import useImportStore from '@stores/import'
import { open as openTauri } from '@tauri-apps/api/shell'

const { t } = useI18n()
const $toast = useToast()
const files = ref<File[]>([])
const loading = ref(false)
const characters = ref<Record<string, any>[]>([])
const { importData } = useImportStore()

defineProps<{
  open: boolean
}>()
const emits = defineEmits(['hide'])

async function onFileSelected(dropped: File) {
  files.value = [dropped]
  const content = await readFileObject(dropped)

  if (dropped.type === 'application/x-yaml') {
    characters.value = readLocalisationFile(content)
  } else if (dropped.type === 'text/plain') {
    characters.value = readCharacterFile(content)
  }
}

async function triggerImport() {
  loading.value = true
  if (characters.value.length <= 0) {
    $toast.error(t('error.no-dir-selected'))
    return
  }

  if (Array.isArray(characters.value)) {
    importData(characters.value)

    loading.value = false
    emits('hide')
    router.push('/import')
  }
}

const handleClick = () =>
  openTauri('https://github.com/Fuhrerredux/automator#how-do-i-automate-creation-of-characters')
</script>

<template>
  <modal :hideable="!loading" :open="open" size="max-w-md" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.character-import.heading') }}
    </template>
    <template #description>
      {{ t('modal.character-import.summary') }}
    </template>
    <template #body>
      <div class="space-y-4">
        <div>
          <drop-zone :files="files" @dropped="onFileSelected" @reset="files = []" />
          <p v-if="characters.length > 0" class="text-sm text-center text-zinc-500">
            {{ t('placeholder.character-parsed', { num: characters.length }) }}
          </p>
        </div>
        <div class="text-sm text-zinc-500 flex items-center">
          <information-circle-icon class="h-6 w-6 shrink-0 mr-4" />

          <i18n-t keypath="info.import-ext" tag="p">
            <template #end>
              <button type="button" class="text-link" @click="handleClick">
                {{ t('action.learn-more') }}
              </button>
            </template>
          </i18n-t>
        </div>
      </div>
      <div>
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <spinner-button
            type="button"
            class="button-primary"
            :loading="loading"
            :disabled="characters.length <= 0 || loading"
            @click="triggerImport">
            <template #content>
              {{ t('action.import') }}
            </template>
            <template #loading>
              <span>{{ t('loading.importing') }}</span>
            </template>
          </spinner-button>
        </div>
      </div>
    </template>
  </modal>
</template>
