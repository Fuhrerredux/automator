<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import Dropdown from '@components/dropdown.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import useTraitsStore from '@stores/traits'

const { t } = useI18n()
const store = useTraitsStore()
const { files, trait } = storeToRefs(store)

function handleChange(event: string) {
  store.$patch({ trait: event })
  localStorage.setItem('trait', event)
}
</script>

<template>
  <div class="w-full">
    <span class="form-label">{{ t('field.traits-def') }}</span>
    <div class="flex items-center gap-4">
      <div class="w-full">
        <dropdown
          :options="files"
          :model-value="trait"
          display-key="name"
          value-key="path"
          @update:model-value="handleChange" />
      </div>
      <button type="button" class="button-primary flex items-center" @click="store.readTraits">
        <arrow-path-icon class="h-5 w-5 mr-2" />
        <span>Load</span>
      </button>
    </div>
  </div>
</template>
