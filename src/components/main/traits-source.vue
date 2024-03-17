<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dropdown from '@components/dropdown.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import useConfiguration from '@stores/config'
import useModStore from '@stores/mod'
import useTraitsStore from '@stores/traits'

const { t } = useI18n()
const modStore = useModStore()
const traitStore = useTraitsStore()
const { config } = useConfiguration()
const { files } = storeToRefs(traitStore)

const traitSource = ref<string | null>(null)
const fileOptions = computed(() =>
  files.value.map((e) => ({ value: e.path, label: e.name ?? e.path }))
)

const onSaveTraits = () => {
  traitStore.readTraits(config)
}
const onChangeTraitSource = (event: string) => {
  if (event) {
    traitStore.$patch({ trait: event })
    localStorage.setItem('trait', event)
    traitSource.value = event
  }
}
</script>

<template>
  <div class="w-full">
    <span class="form-label">{{ t('field.traits-def') }}</span>
    <div class="flex items-center gap-4">
      <div class="w-full">
        <dropdown
          :options="fileOptions"
          :model-value="traitSource"
          :disabled="modStore.directory.length <= 0"
          @update:model-value="onChangeTraitSource" />
      </div>
      <button
        type="button"
        class="button-primary flex items-center shrink-0"
        :disabled="modStore.directory.length <= 0"
        @click="onSaveTraits">
        <arrow-path-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.load') }}</span>
      </button>
    </div>
  </div>
</template>
