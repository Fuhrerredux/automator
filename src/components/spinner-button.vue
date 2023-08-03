<script setup lang="ts">
import Spinner from '@components/spinner.vue'

defineOptions({
  inheritAttrs: false
})
defineProps<{
  loading: boolean
}>()
</script>

<template>
  <button v-bind="$attrs" class="inline-flex items-center justify-center">
    <template v-if="loading">
      <spinner class="mr-2" dimensions="h-4 w-4" />
      <slot name="loading"></slot>
    </template>
    <template v-else class="flex items-center justify-center">
      <slot name="content"></slot>
    </template>
  </button>
</template>
