<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'

const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)

const { purgeFn } = defineProps<{
  open: boolean
  purgeFn: () => Promise<void>
}>()
const emits = defineEmits(['hide'])

async function submit() {
  try {
    loading.value = true

    await purgeFn()
    $toast.success(t('status.database-removed'))

    emits('hide')
  } catch (e) {
    $toast.error(String(e))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <modal :hideable="!loading" :open="open" size="max-w-md" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.purge-characters.heading') }}
    </template>
    <template #description>
      {{ t('modal.purge-characters.summary') }}
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <spinner-button type="submit" class="button-destructive" :loading="loading">
            <template #content>
              {{ t('action.purge') }}
            </template>
            <template #loading>
              <span>{{ t('loading.purging') }}</span>
            </template>
          </spinner-button>
        </div>
      </form>
    </template>
  </modal>
</template>
