<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useSettingsStore from '@/stores/settings'
import Page from '@components/page.vue'
import SwitchButton from '@components/switch.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const positionPrevention = ref(settingsStore.positionPrevention)
</script>

<template>
  <page>
    <div class="items-center justify-between flex-auto">
      <h1 class="header">{{ t('settings.header') }}</h1>
    </div>
    <section class="mt-4 space-y-4">
      <h2 class="text-sm font-medium uppercase">Character Settings</h2>
      <switch-button
        :checked="positionPrevention"
        :label="t('settings.positionPrevention')"
        @update:model-value="positionPrevention = $event" />
    </section>
  </page>
</template>
