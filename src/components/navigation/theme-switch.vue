<template>
  <div class="flex items-center">
    <Switch
      :model-value="checked"
      :class="checked ? 'bg-zinc-900' : 'bg-zinc-200 '"
      class="relative inline-flex h-6 w-14 items-center rounded-full focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-200"
      @update:model-value="$emit('update:modelValue', $event)">
      <div
        class="inline-block h-4 w-4 transform ease-in duration-300 rounded-full transition-all relative"
        :class="{ 'translate-x-9': checked, 'translate-x-1': !checked }">
        <moon-icon v-if="checked" class="opacity-100" />
        <sun-icon v-else-if="!checked" class="opacity-100 stroke-current text-zinc-900" />
      </div>
    </Switch>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

defineProps({ checked: Boolean })
defineEmits(['update:modelValue'])
</script>
