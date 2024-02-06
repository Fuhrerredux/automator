<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useSettingsStore from '@/stores/settings'
import Page from '@components/page.vue'
import SwitchButton from '@components/switch.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()

</script>

<template>
  <page>
    <div class="items-center justify-between flex-auto">
      <h1 class="header">{{ t('settings.header') }}</h1>
    </div>
    <div class="space-y-4 mt-4">
      <section class="space-y-4">
        <h2 class="text-sm font-medium uppercase">Character Settings</h2>
        <switch-button
        :checked="settingsStore.getPositionPrevention"
        :label="t('settings.position-prevention')"
        @update:model-value="settingsStore.togglePositionPrevention" />
      </section>
      <section class="space-y-4">
        <h2 class="text-sm font-medium uppercase">Logging Settings</h2>
        <switch-button
          :checked="settingsStore.getOptionLogging()"
          :label="t('settings.option-logging')"
          @update:model-value="settingsStore.toggleOptionLogging"
        />
      </section>
      <section class="space-y-4">
        <h2 class="text-sm font-medium uppercase">Configuration</h2>
        <switch-button
          :checked="settingsStore.getCustomConfig()"
          :label="t('settings.custom-config')"
          @update:model-value="settingsStore.toggleCustomConfig"
        />
      </section>
    </div>
  </page>
</template>
