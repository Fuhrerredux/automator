<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CharacterRecruit from '@components/others/character-recruit.vue'
import ShineGeneration from '@components/others/shine-generation.vue'

const { t } = useI18n()
</script>

<template>
  <main class="page">
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.others') }}</h1>
    </div>
    <div class="mt-4">
      <ul class="space-y-4">
        <shine-generation />
        <character-recruit />
      </ul>
    </div>
  </main>
</template>
