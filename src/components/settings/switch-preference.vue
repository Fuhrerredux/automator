<script setup lang="ts">
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import SwitchButton from '@components/switch.vue'
import useSettingsStore from '@stores/settings'

const props = defineProps<{
  preferenceKey: keyof Automator.Preference
  label: string
}>()

const settingsStore = useSettingsStore()
const { t } = useI18n()

const checked = toRef(settingsStore.getPreference(props.preferenceKey) as boolean)

const onChange = (event: boolean) => {
  settingsStore.updatePreference(props.preferenceKey, event)
  checked.value = event
}
</script>

<template>
  <switch-button :checked="checked" :label="t(label)" @update:model-value="onChange" />
</template>
