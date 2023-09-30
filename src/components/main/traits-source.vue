<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import Dropdown from '@components/dropdown.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import useModStore from '@stores/mod'
import useTraitsStore from '@stores/traits'

const { t } = useI18n()
const modStore = useModStore()
const traitStore = useTraitsStore()
const { files, trait } = storeToRefs(traitStore)

function handleChange(event: string | null) {
  if (event) {
    traitStore.$patch({ trait: event })
    localStorage.setItem('trait', event)
  }
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
          :disabled="modStore.directory.length <= 0"
          display-key="name"
          value-key="path"
          @update:model-value="handleChange" />
      </div>
      <button
        type="button"
        class="button-primary flex items-center shrink-0"
        :disabled="modStore.directory.length <= 0"
        @click="traitStore.readTraits">
        <arrow-path-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.load') }}</span>
      </button>
    </div>
  </div>
</template>
