<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import CharacterRepository from '@database/repository'

const { t } = useI18n()
const loading = ref(false)

const props = defineProps<{
  open: boolean
  character: CharacterWithId
  refresh: () => Promise<void>
}>()
defineEmits(['hide'])

async function submit() {
  try {
    loading.value = true

    const controller = CharacterRepository.getInstance()
    await controller.remove(props.character)
  } catch {
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
