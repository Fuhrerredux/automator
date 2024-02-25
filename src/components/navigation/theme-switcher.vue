<script setup lang="ts">
import useThemeStore from '@stores/theme'
import themeSwitch from './theme-switch.vue'
import { ref } from 'vue'
const themeStore = useThemeStore()
const { change } = themeStore

let changeTheme = ref(false)

function onChange(event: boolean) {
  changeTheme.value = event
  event ? change('dark') : change('light')
}

</script>

<template>
  <themeSwitch
    :checked="changeTheme"
    @update:model-value="onChange"
  />
</template>
