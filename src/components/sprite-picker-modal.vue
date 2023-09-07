<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@components/modal.vue'
import RadioGroup from '@components/radio-group.vue'
import options from '@shared/const/sprites'

defineProps<{
  open: boolean
}>()
defineEmits<{
  (e: 'hide'): void
  (e: 'select', v: SpriteType): void
}>()

const { t } = useI18n()
const item = ref<SpriteType>(options[0].value)
</script>

<template>
  <modal :open="open" size="max-w-md" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.sprite-analyze.heading') }}
    </template>
    <template #description>
      {{ t('modal.sprite-analyze.summary') }}
    </template>
    <template #body>
      <div class="space-y-4">
        <div>
          <radio-group
            display-key="label"
            value-key="value"
            :options="options"
            :model-value="item"
            @update:model-value="item = $event" />
        </div>
      </div>
      <div>
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <button type="button" class="button-primary" @click="$emit('select', item)">
            {{ t('action.select') }}
          </button>
        </div>
      </div>
    </template>
  </modal>
</template>
