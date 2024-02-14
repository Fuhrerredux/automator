<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import { removeFile } from '@tauri-apps/api/fs'

const props = defineProps<{
  open: boolean
  selected: string[]
}>()
const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'success'): void
}>()

const { t } = useI18n()
const loading = ref(false)
const $toast = useToast()

async function removeAll() {
  try {
    loading.value = true
    const promises = props.selected.map((e) => removeFile(e))
    await Promise.all(promises)

    $toast.success(t('status.file-removed'))
    emit('success')
  } catch (e) {
    $toast.error(String(e))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <modal size="max-w-md" :open="open" :hideable="true" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.purge-files.heading') }}
    </template>
    <template #description>
      {{ t('modal.purge-files.summary') }}
    </template>
    <template #body>
      <div>
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <spinner-button
            type="button"
            class="button-destructive"
            :loading="loading"
            @click="removeAll">
            <template #content>
              {{ t('action.purge') }}
            </template>
            <template #loading>
              <span>{{ t('loading.purging') }}</span>
            </template>
          </spinner-button>
        </div>
      </div>
    </template>
  </modal>
</template>
