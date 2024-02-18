<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import SwitchPreference from '@/components/settings/switch-preference.vue'
import Dropdown from '@components/dropdown.vue'
import Page from '@components/page.vue'
import PreferenceGroup from '@components/settings/preference-group.vue'
import predefinedConfigurations from '@shared/const/config'
import useConfiguration from '@stores/config'
import useSettingsStore from '@stores/settings'

const $toast = useToast()
const { t } = useI18n()
const settingsStore = useSettingsStore()
const configurationStore = useConfiguration()

const config = ref(predefinedConfigurations[0])

const handleConfigurationChange = (value: DropdownOption<string>) => {
  if (value.value !== 'none') {
    settingsStore.updatePreference('predefinedConfiguration', value.value)
    configurationStore.change(value.value)
    config.value = value

    $toast.success(t('status.config-updated'))
  } else {
    $toast.success(t('status.config-removed'))
  }
}
</script>

<template>
  <page>
    <div class="items-center justify-between flex-auto">
      <h1 class="header">{{ t('settings.header') }}</h1>
    </div>
    <div class="space-y-4 mt-4">
      <preference-group title="settings.character">
        <switch-preference
          label="settings.position-prevention"
          preference-key="positionPrevention" />
      </preference-group>
      <preference-group title="settings.logging">
        <switch-preference label="settings.option-logging" preference-key="optionLogging" />
      </preference-group>
      <preference-group title="settings.configuration">
        <switch-preference label="settings.custom-config" preference-key="customConfig" />
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
      </preference-group>
    </div>
  </page>
</template>
@/shared/const/config
