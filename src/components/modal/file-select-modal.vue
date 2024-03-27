<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DropZone from '@components/drop-zone.vue'
import Modal from '@components/modal.vue'

const props = defineProps<{
  open: boolean
  multiple?: boolean
}>()
defineEmits<{
  (e: 'hide'): void
  (e: 'select', files: File[]): void
}>()

const { t } = useI18n()
const files = ref<File[]>([])
const loading = ref(false)

function handleFileDropped(dropped: File) {
  if (props.multiple) {
    const updated = Array.from(files.value)
    updated.push(dropped)
    files.value = updated
  } else {
    files.value = [dropped]
  }
}

function handleFileReset(file: File) {
  if (props.multiple) {
    let updated = Array.from(files.value)
    updated = updated.filter((e) => e.name !== file.name)
    files.value = [...updated]
  } else {
    files.value = []
  }
}
</script>

<template>
  <modal :hideable="!loading" :open="open" size="max-w-md" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.file-select.heading') }}
    </template>
    <template #description>
      {{ t('modal.file-select.summary') }}
    </template>
    <template #body>
      <div class="space-y-4">
        <div>
          <drop-zone
            :multiple="multiple"
            :files="files"
            @dropped="handleFileDropped"
            @reset="handleFileReset" />
        </div>
      </div>
      <div>
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <button type="button" class="button-primary" @click="$emit('select', files)">
            {{ t('action.select') }}
          </button>
        </div>
      </div>
    </template>
  </modal>
</template>
