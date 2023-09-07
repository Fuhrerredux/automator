<script
  setup
  lang="ts"
  generic="
    V extends string | number | boolean | object | null | undefined,
    I extends object | string
  ">
import { computed } from 'vue'
import useKeys from '@composables/use-keys'
import { RadioGroupOption, RadioGroup as TwRadioGroup } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  options: I[]
  valueKey: KeyOfType<I, V> | ((item: I) => V)
  displayKey: keyof I | ((item: I) => string)
  modelValue: V
  disabled?: boolean
}>()
defineEmits<{
  (e: 'update:modelValue', value: V): void
}>()
const { valueFunc, displayFunc } = useKeys<V, I>(props)
const item = computed(() => props.options.find((i) => valueFunc(i) === props.modelValue))
</script>

<template>
  <tw-radio-group
    as="ul"
    class="relative space-y-2"
    :model-value="item"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', valueFunc($event))">
    <radio-group-option
      v-for="option of options"
      v-slot="{ checked }"
      :value="option"
      as="template">
      <li
        class="relative pr-3 pl-10 py-2 border-2 text-sm dark:border-zinc-700 rounded-md"
        :class="checked && 'border-zinc-700'">
        <check-icon v-if="checked" class="h-5 w-5 absolute inset-y-0 left-0 m-2" />
        <span>{{ displayFunc(option) }}</span>
      </li>
    </radio-group-option>
  </tw-radio-group>
</template>
