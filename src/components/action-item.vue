<script setup lang="ts">
import Spinner from '@components/spinner.vue'
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
  summary: string
  loading?: boolean
  finished?: boolean
}>()
defineEmits(['action'])
</script>

<template>
  <li class="w-full flex items-center justify-center gap-4">
    <div class="shrink-0">
      <slot name="icon"></slot>
    </div>
    <div class="flex-1">
      <dt class="font-medium">{{ title }}</dt>
      <dd class="text-sm text-zinc-500">{{ summary }}</dd>
    </div>
    <div class="shrink-0">
      <button type="button" class="button-secondary" @click="$emit('action')">
        <check-icon v-if="finished && !loading" class="h-5 w-5" />
        <chevron-right-icon v-if="!finished && !loading" class="h-5 w-5 text-zinc-500" />
        <spinner v-if="loading" dimensions="w-5 h-5" />
      </button>
    </div>
  </li>
</template>
