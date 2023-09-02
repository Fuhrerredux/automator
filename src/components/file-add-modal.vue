<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import useModStore from '@/stores/mod'
import DropZone from '@components/drop-zone.vue'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import useSpriteDefinitionsStore from '@stores/definitions'

defineProps<{
  open: boolean
}>()
defineEmits(['hide'])

const { t } = useI18n()
const files = ref<File[]>([])
const loading = ref(false)
const modStore = useModStore()
const { importToFiles, findDuplicates, checkExistence, findOrphaned } = useSpriteDefinitionsStore()

function onFileSelected(dropped: File) {
  const updated = Array.from(files.value)
  updated.push(dropped)
  files.value = updated
}

function handleFileRemove(file: File) {
  let updated = Array.from(files.value)
  updated = updated.filter((e) => e.name !== file.name)
  files.value = updated
}

async function triggerImport() {
  loading.value = true
  try {
    await importToFiles(files.value)
    await checkExistence(modStore.directory)
    findDuplicates()
    await findOrphaned(modStore.directory)

    router.push('/analyze')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <modal size="max-w-md" :hideable="!loading" :open="open" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.file-add.heading') }}
    </template>
    <template #description>
      {{ t('modal.file-add.summary') }}
    </template>
    <template #body>
      <div>
        <drop-zone multiple :files="files" @dropped="onFileSelected" @reset="handleFileRemove" />
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
