<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import useConfiguration from '@/stores/config'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { exportCharacters } from '@shared/core/writer'
import useCharacterStore from '@stores/characters'
import useModStore from '@stores/mod'

const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)
const modStore = useModStore()
const { config } = useConfiguration()
const characterStore = useCharacterStore()
const { characters } = storeToRefs(characterStore)

defineProps<{
  open: boolean
}>()
const emits = defineEmits(['hide'])

async function triggerExports() {
  loading.value = true
  if (modStore.directory.length <= 0) {
    $toast.error(t('error.no-dir-selected'))
    return
  }

  const data = characterStore.characters
  const common = modStore.getCommonDirectory

  if (Array.isArray(data) && common) {
    await exportCharacters(data, common.path, config)

    loading.value = false
    $toast.success(t('status.characters-exported'))
    emits('hide')
  }
}
</script>

<template>
  <modal :hideable="!loading" :open="open" size="max-w-md" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.character-export.heading') }}
    </template>
    <template #description>
      {{ t('modal.character-export.summary') }}
    </template>
    <template #body>
      <div v-if="characters.length <= 0" class="w-2/3 mx-auto text-center banner-warning">
        <exclamation-triangle-icon class="inline-block w-6 h-6" />
        <p>{{ t('error.no-characters-to-export') }}</p>
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
            @click="triggerExports">
            <template #content>
              {{ t('action.export') }}
            </template>
            <template #loading>
              <span>{{ t('loading.exporting') }}</span>
            </template>
          </spinner-button>
        </div>
      </div>
    </template>
  </modal>
</template>
