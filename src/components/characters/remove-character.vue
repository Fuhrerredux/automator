<script setup lang="ts">
import { isProxy, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'

const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)

const { character, removeFn } = defineProps<{
  open: boolean
  character: CharacterWithId
  removeFn: (character: CharacterWithId) => Promise<Tauri.Broadcast>
}>()
const emits = defineEmits(['hide'])

async function submit() {
  try {
    loading.value = true

    if (isProxy(character)) await removeFn(toRaw(character))
    else await removeFn(character)
    $toast.success(t('status.character-removed'))

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
      {{ t('modal.remove-character.heading') }}
    </template>
    <template #description>
      {{ t('modal.remove-character.summary', { name: character.name, tag: character.tag }) }}
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <spinner-button type="submit" class="button-destructive" :loading="loading">
            <template #content>
              {{ t('action.remove') }}
            </template>
            <template #loading>
              <span>{{ t('loading.removing') }}</span>
            </template>
          </spinner-button>
        </div>
      </form>
    </template>
  </modal>
</template>
