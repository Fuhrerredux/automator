<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  title: string
}>()

const { t } = useI18n()
</script>

<template>
  <section class="space-y-4 highlight-section">
    <h2 class="section-header">{{ t(title) }}</h2>
    <div class="space-y-2">
      <slot />
    </div>
  </section>
</template>
