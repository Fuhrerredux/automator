<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AnalyzeRow from './row.vue'

defineProps<{
  data: AnalyzeData[]
}>()

const { t } = useI18n()
</script>

<template>
  <table>
    <thead>
      <th scope="col">{{ t('field.sprite') }}</th>
      <th scope="col">{{ t('field.path') }}</th>
      <th scope="col">{{ t('field.status') }}</th>
    </thead>
    <tbody>
      <analyze-row v-for="item of data" :data="item" />
    </tbody>
  </table>
</template>
