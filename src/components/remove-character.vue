<script setup lang="ts">
import { ref } from 'vue'
import { Translation, useI18n } from 'vue-i18n'
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
      <translation keypath="modal.remove-character.summary" tag="span" scope="global">
        <template v-slot:name>
          <span class="font-medium text-zinc-800 dark:text-zinc-100">{{ character.name }}</span>
        </template>
        <template v-slot:tag>
          <span>{{ character.tag }}</span>
        </template>
      </translation>
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <spinner-button type="submit" class="button-primary" :loading="loading">
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

<i18n lang="json">
{
  "en": {
    "heading": "Remove character?",
    "summary": "Are you sure you want to remove the character \"{name}\" for the {tag} tag? This action cannot be undone."
  }
}
</i18n>
