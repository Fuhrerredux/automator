<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { exportShine } from '@shared/core/writer'
import useModStore from '@stores/mod'

const store = useModStore()
const { t } = useI18n()

async function generate() {
  await exportShine(`${store.directory}/gfx`)
}
</script>

<template>
  <div>
    <h3 class="form-label">{{ t('field.generate-shines') }}</h3>
    <button type="button" class="button-primary flex items-center" @click="generate">
      <bolt-icon class="h-5 w-5 mr-2" />
      <span>{{ t('action.generate') }}</span>
    </button>
  </div>
</template>
