<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useCustomConfig from '@/stores/config'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'

type IdeologyDropdownProps = {
  current?: Ideology | null
  disabled?: boolean
} & (
  | {
      modelValue: Ideology | null
      multiple?: false
    }
  | {
      modelValue: Ideology[]
      multiple?: true
    }
)
type IdeologyDropdownType = IdeologyDropdownProps['multiple']
type IdeologyDropdownEmits<T extends boolean | undefined> = {
  (e: 'update:modelValue', value: T extends true ? Ideology[] : Ideology): void
}

const props = defineProps<IdeologyDropdownProps>()
defineEmits<IdeologyDropdownEmits<IdeologyDropdownType>>()

const { t } = useI18n()
const configStore = useCustomConfig()

const ideologyOptions = computed(() => {
  return Object.entries(configStore.config.ideologies)
    .map(([key, value]) => ({ key, name: value.name, short: value.short }))
    .filter((e) => e.key !== props.current?.key)
})
const label = computed(() => {
  if (props.multiple) return props.modelValue.map((e) => e.name).join(', ')
  else return props.modelValue?.name
})
</script>

<template>
  <listbox
    as="div"
    class="relative"
    :multiple="multiple"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', $event)">
    <listbox-button class="dropdown-button w-full">
      <span class="truncate inline-block flex-1 text-left">
        {{
          (Array.isArray(modelValue) && modelValue.length > 0) ||
          (typeof modelValue === 'object' && !Array.isArray(modelValue) && Boolean(modelValue))
            ? label
            : t(multiple ? 'placeholder.dropdown-multiple' : 'placeholder.dropdown')
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
          v-for="option in ideologyOptions"
          v-slot="{ selected }"
          :value="option"
          as="template">
          <li :key="option.key" class="dropdown-option truncate">
            <span :class="selected ? 'font-medium' : 'font-normal'">
              {{ t(option.name) }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-600 dark:text-zinc-300">
              <check-icon class="h-4 w-4" aria-hidden="true" />
            </span>
          </li>
        </listbox-option>
      </listbox-options>
    </transition>
  </listbox>
</template>
