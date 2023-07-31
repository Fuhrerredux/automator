<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ModDirectory from '@components/main/mod-directory.vue'
import TraitsSource from '@components/main/traits-source.vue'

const { t } = useI18n()
</script>

<template>
  <main class="page">
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.main') }}</h1>
    </div>
    <div class="mt-4 space-y-4">
      <mod-directory />
      <div class="border-t dark:border-t-zinc-600 py-4 grid grid-cols-2 gap-4">
        <traits-source />
      </div>
    </div>
  </main>
</template>
