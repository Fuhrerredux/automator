<template>
  <div class="flex items-center">
    <Switch
      :model-value="checked"
      :class="checked ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-600'"
      class="relative inline-flex h-6 w-11 items-center rounded-full"
      @update:model-value="$emit('update:modelValue', $event)">
      <span class="sr-only">{{ label }}</span>
      <span
        :class="checked ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
    </Switch>
    <div :class="labelClass ? labelClass : 'ml-2 text-sm font-medium'">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
  import { Switch } from '@headlessui/vue';
  defineProps({ checked: Boolean, label: String, labelClass: String });
  defineEmits(['update:modelValue']);
</script>
