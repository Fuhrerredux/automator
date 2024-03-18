<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n()
const props = defineProps<{
  options: UserInterface.DataOption[]
  modelValue: string | undefined | null
  disabled?: boolean
  localise?: boolean
  multiple?: boolean
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const item = computed(() => props.options.find((e) => e.value === props.modelValue))
const keys = computed(() => props.options.map((e) => e.value))

const onChange = (item: UserInterface.DataOption) => {
  emits('update:modelValue', item.value)
}
</script>

<template>
  <listbox
    :model-value="item"
    :disabled="disabled"
    @update:model-value="onChange"
    as="div"
    class="relative">
    <listbox-button class="w-full dropdown-button">
      <span class="flex-1 text-left truncate">
        {{ item && keys.includes(item.value) ? item?.label : t('placeholder.dropdown') }}
      </span>
      <chevron-down-icon class="w-4 h-4 ml-2" />
    </listbox-button>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0">
      <listbox-options as="ul" class="dropdown-panel">
        <listbox-option
          as="template"
          v-for="option in options"
          v-slot="{ selected }"
          :value="option">
          <li :key="option.value" class="truncate dropdown-option">
            <span>
              {{ localise ? t(option.label) : option.label }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-600">
              <check-icon class="w-4 h-4" aria-hidden="true" />
            </span>
          </li>
        </listbox-option>
      </listbox-options>
    </transition>
  </listbox>
</template>
