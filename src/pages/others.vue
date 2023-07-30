<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="page">
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.others') }}</h1>
    </div>
  </main>
</template>
