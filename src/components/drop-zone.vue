<script setup lang="ts">
import { useDropzone } from 'vue3-dropzone'
import { useI18n } from 'vue-i18n'
import { FolderOpenIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
defineProps<{ file: File | null }>()
const emits = defineEmits<{
  (e: 'dropped', v: File): void | Promise<void>
  (e: 'reset'): void | Promise<void>
}>()

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  multiple: false,
  onDrop
})

function onDrop(acceptFiles: File[]) {
  if (acceptFiles.length > 0) {
    emits('dropped', acceptFiles[0])
  }
}

function handleClickDeleteFile() {
  emits('reset')
}
</script>

<template>
  <div class="text-sm">
    <div v-if="file" class="border rounded-md p-2 space-y-2">
      <div class="flex items-center justify-center">
        <span class="flex-1 font-medium text-zinc-700 dark:text-zinc-200">
          {{ file.name }}
        </span>
        <button type="button" class="button-destructive shrink-0" @click="handleClickDeleteFile">
          {{ t('action.remove') }}
        </button>
      </div>
    </div>
    <div v-else class="text-center text-zinc-500 dark:text-zinc-400" v-bind="getRootProps()">
      <div
        class="border border-dashed dark:border-zinc-600 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-600 cursor-pointer"
        :class="isDragActive && 'active'">
        <input v-bind="getInputProps()" />
        <folder-open-icon class="h-6 w-6 inline-block mb-1" />
        <p v-if="isDragActive">{{ t('field.dropzone-active') }}</p>
        <p v-else class="font-medium">{{ t('field.dropzone') }}</p>
      </div>
    </div>
  </div>
</template>
