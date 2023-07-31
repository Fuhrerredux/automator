<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  positions: Position[]
}>()

const remaining = ref(0)
const firstThree = ref(props.positions)

onMounted(() => {
  if (props.positions.length > 3) {
    firstThree.value = props.positions.slice(0, 3)
    remaining.value = props.positions.length - 3
  }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span v-for="position of firstThree" :key="position" class="chip-primary truncate">
      {{ t(`roles.${position}`) }}
    </span>
    <span v-if="remaining > 0" class="chip-primary truncate">
      {{ t('placeholder.remaining', { num: remaining }) }}
    </span>
  </div>
</template>
