<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label>
    <span class="form-label">{{ label }}</span>
    <input v-bind="$attrs" class="form-input" :value="modelValue" @input="handleInput" />
  </label>
</template>
