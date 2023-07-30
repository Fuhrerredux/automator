<script
  setup
  lang="ts"
  generic="V extends string | number | boolean | object | null | undefined, I extends object">
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import useKeys from '@composables/use-keys'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  options: I[]
  valueKey: KeyOfType<I, V> | ((item: I) => V)
  displayKey: keyof I | ((item: I) => V)
  modelValue: V
  localise?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: V): void
}>()
const { valueFunc, displayFunc } = useKeys(props)

const item = computed(() => props.options.find((i) => valueFunc(i) === props.modelValue))
</script>

<template>
  <listbox
    :model-value="item"
    @update:model-value="emit('update:modelValue', valueFunc($event))"
    as="div"
    class="relative">
    <listbox-button class="dropdown-button w-full">
      <span class="flex-1 text-left">
        {{ item ? t(displayFunc(item)) : t('placeholder.dropdown') }}
      </span>
      <chevron-down-icon class="ml-2 h-4 w-4" />
    </listbox-button>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0">
      <listbox-options as="ul" class="dropdown-panel">
        <listbox-option v-for="option in options" :value="option" as="template">
          <li :key="String(valueFunc(option))" class="dropdown-option">
            {{ localise ? t(displayFunc(option)) : displayFunc(option) }}
          </li>
        </listbox-option>
      </listbox-options>
    </transition>
  </listbox>
</template>
