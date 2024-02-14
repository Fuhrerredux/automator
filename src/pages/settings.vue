<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useSettingsStore from '@/stores/settings'
import Page from '@components/page.vue'
import SwitchButton from '@components/switch.vue'
import { ref } from 'vue'
import Dropdown from '@components/dropdown.vue'
import useConfigurationPresets from '@shared/const/settings'
import { relaunch } from '@tauri-apps/api/process';
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { removeFile, BaseDirectory } from '@tauri-apps/api/fs'

const { t } = useI18n()
const settingsStore = useSettingsStore()

const options = ref<{
  id: number;
  name: string;
}[]>([
  { id: 0, name: t('settings.ideologies.fx-ideologies') },
  { id: 1, name: t('settings.ideologies.kr-ideologies') },
  { id: 2, name: t('settings.ideologies.vanilla-ideologies') }
])

const selectedOption = ref<number>(
  settingsStore.getNumericalSetting('ideologiesType')
)

const updateSelectedOption = async (val: number) => {
  await useConfigurationPresets(val)
  settingsStore.updateNumericalSetting('ideologiesType', val)
}

async function reloadApplication() {
  await relaunch()
}

async function deleteDatabase() {
  await reloadApplication()
  await removeFile('.automator/data/db.sqlite', { dir: BaseDirectory.Home})
}

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
        :checked="settingsStore.getPositionPrevention()"
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
        <h3 class="ml-2 text-sm font-medium">{{ t('settings.predefined-ideology-label') }}</h3>
          <dropdown
            :options="options"
            localise
            :value-key="(item) => item.id"
            :display-key="'name'"
            v-model="selectedOption"
            @update:model-value="updateSelectedOption"
          />
      </section>
      <section class="space-y-4">
        <div class="dialog-actions">
          <button type="button" class="button-destructive flex" @click="reloadApplication()">
            <exclamation-triangle-icon class="h-6 w-6 mr-2" />
            Reload Application
          </button>
          <button type="button" class="button-destructive flex" @click="deleteDatabase()">
            <exclamation-triangle-icon class="h-6 w-6 mr-2" />
            Delete Database
          </button>
        </div>
      </section>
    </div>
  </page>
</template>
