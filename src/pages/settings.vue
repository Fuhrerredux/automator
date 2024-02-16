<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useSettingsStore from '@/stores/settings'
import Dropdown from '@components/dropdown.vue'
import Page from '@components/page.vue'
import SwitchButton from '@components/switch.vue'
import predefinedConfigurations from '@shared/const/config'
import useConfiguration from '@stores/config'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const configurationStore = useConfiguration()

const config = ref(predefinedConfigurations[0])

const handleConfiguration = (value: boolean) => {
  settingsStore.toggleCustomConfig()
  if (!value) configurationStore.revert()
}

const handleConfigurationChange = (value: DropdownOption<string>) => {
  settingsStore.updatePreference('predefinedConfiguration', value.value)
  configurationStore.change(value.value)
  config.value = value
}
</script>

<template>
  <page>
    <div class="items-center justify-between flex-auto">
      <h1 class="header">{{ t('settings.header') }}</h1>
    </div>
    <div class="space-y-4 mt-4">
      <section class="space-y-4">
        <h2 class="section-header">{{ t('settings.character') }}</h2>
        <switch-button
          :checked="settingsStore.getPositionPrevention()"
          :label="t('settings.position-prevention')"
          @update:model-value="settingsStore.togglePositionPrevention" />
      </section>
      <section class="space-y-4">
        <h2 class="section-header">{{ t('settings.logging') }}</h2>
        <switch-button
          :checked="settingsStore.getOptionLogging()"
          :label="t('settings.option-logging')"
          @update:model-value="handleConfiguration" />
      </section>
      <section class="space-y-4">
        <h2 class="section-header">{{ t('settings.configuration') }}</h2>
        <switch-button
          :checked="settingsStore.getCustomConfig()"
          :label="t('settings.custom-config')"
          @update:model-value="settingsStore.toggleCustomConfig" />
        <div className="flex items-center gap-4" v-if="settingsStore.getCustomConfig()">
          <legend class="text-sm shrink-0 font-medium">
            {{ t('settings.predefined-configs') }}
          </legend>
          <div class="flex-1">
            <dropdown
              localise
              :options="predefinedConfigurations"
              v-model="config"
              @update:model-value="handleConfigurationChange" />
          </div>
        </div>
      </section>
    </div>
  </page>
</template>
@/shared/const/config
