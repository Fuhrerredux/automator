<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n()
const props = defineProps<{
  options: UserInterface.DataOption[]
  modelValue: UserInterface.DataOption | undefined | null
  disabled?: boolean
  localise?: boolean
  multiple?: boolean
}>()
defineEmits<{
  (e: 'update:modelValue', value: UserInterface.DataOption): void
}>()

const keys = computed(() => props.options.map((e) => e.value))
</script>

<template>
  <listbox
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', $event)"
    as="div"
    class="relative">
    <listbox-button class="dropdown-button w-full">
      <span class="flex-1 text-left truncate">
        {{
          modelValue && keys.includes(modelValue.value)
            ? modelValue.label
            : t('placeholder.dropdown')
        }}
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
        <listbox-option
          as="template"
          v-for="option in options"
          v-slot="{ selected }"
          :value="option">
          <li :key="option.value" class="dropdown-option truncate">
            <span>
              {{ localise ? t(option.label) : option.label }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-600">
              <check-icon class="h-4 w-4" aria-hidden="true" />
            </span>
          </li>
        </listbox-option>
      </listbox-options>
    </transition>
  </listbox>
</template>
