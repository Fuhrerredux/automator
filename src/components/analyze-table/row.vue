<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  data: AnalyzeData
}>()

const { t } = useI18n()
const status = computed(() => {
  switch (props.data.status) {
    case 'missing':
      return 'chip-warning'
    case 'undef':
      return 'chip-error'
    default:
      return 'chip-primary'
  }
})
</script>

<template>
  <tr>
    <th scope="row">{{ data.sprite }}</th>
    <td>{{ data.path }}</td>
    <td>
      <span :class="status">{{ t(`status.${data.status}`) }}</span>
    </td>
  </tr>
</template>
