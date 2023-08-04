<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import router from '@/router'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import { readCharacterFile } from '@shared/core/reader'
import { readFileObject } from '@shared/utils/reader'
import useImportStore from '@stores/import'

const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)
const characters = ref<Record<string, any>[]>([])
const { importData } = useImportStore()

defineProps<{
  open: boolean
}>()
const emits = defineEmits(['hide'])

async function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]
    const content = await readFileObject(file)
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
    $toast.success(t('status.characters-imported'))
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
        <label for="path">
          <input type="file" name="path" id="path" class="form-file" @change="onFileSelected" />
        </label>
        <p class="text-sm text-center mt-4">
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
