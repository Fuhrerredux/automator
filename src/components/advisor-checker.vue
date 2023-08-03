<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Modal from '@components/modal.vue'

const { t } = useI18n()
defineProps<{
  open: boolean
}>()
defineEmits(['hide'])
</script>

<template>
  <modal :hideable="false" :open="open" size="max-w-lg" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.check-character.heading') }}
    </template>
    <template #description>
      {{ t('modal.check-character.heading') }}
    </template>
    <template #body> </template>
  </modal>
</template>
