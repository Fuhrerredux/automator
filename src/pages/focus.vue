<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Page from '@components/page.vue'
import designer from '@components/national-focus/designer.vue'

const { t } = useI18n()
</script>

<template>
  <page>
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.nationalfocus') }}</h1>
    </div>
    <div class="max-w-screen-xl mx-auto w-[76rem] h-[36rem] max-h-screen">
      <designer />
    </div>
  </page>
</template>