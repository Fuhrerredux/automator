<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import DropZone from '@components/drop-zone.vue'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import { readCharacterFile } from '@shared/core/reader'
import { readFileObject } from '@shared/utils/reader'
import useImportStore from '@stores/import'

const { t } = useI18n()
const $toast = useToast()
const file = ref<File | null>(null)
const loading = ref(false)
const characters = ref<Record<string, any>[]>([])
const { importData } = useImportStore()

defineProps<{
  open: boolean
}>()
const emits = defineEmits(['hide'])

async function onFileSelected(dropped: File) {
  file.value = dropped
  const content = await readFileObject(dropped)
  characters.value = readCharacterFile(content)
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
      <div>
        <div>
          <drop-zone :file="file" @dropped="onFileSelected" @reset="file = null" />
        </div>
        <p v-if="characters.length > 0" class="text-sm text-center mt-4 text-zinc-500">
          {{ t('placeholder.character-parsed', { num: characters.length }) }}
        </p>
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
