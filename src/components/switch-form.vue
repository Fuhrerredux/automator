<script setup lang="ts">
import { useField } from 'vee-validate'
import * as yup from 'yup'
import { toRef } from 'vue'
import { Switch } from '@headlessui/vue'

const props = defineProps<{ name: string; label: string; value: string }>()

const name = toRef(props, 'name')
const { checked, handleChange } = useField(name, yup.boolean(), {
  type: 'checkbox',
  checkedValue: props.value
})
</script>

<template>
  <div class="flex items-center">
    <Switch
      class="relative inline-flex h-6 w-11 items-center rounded-full"
      :value="value"
      :model-value="checked"
      :class="checked ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-600'"
      @update:model-value="handleChange($event)">
      <span class="sr-only">{{ label }}</span>
      <span
        :class="checked ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
    </Switch>
    <div class="ml-2 text-sm font-medium">{{ label }}</div>
  </div>
</template>
