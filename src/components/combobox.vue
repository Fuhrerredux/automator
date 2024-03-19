<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'
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

let selected = ref(props.options[0])
let query = ref('')

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option) =>
        option.value
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)

const item = computed(() => props.options.find((e) => e.value === props.modelValue))

const onChange = (item: UserInterface.DataOption) => {
  emits('update:modelValue', item.value)
}

const showAllOptions = () => {
  if (query.value === '') {
    query.value = '' // Clear the query to display all options
  }
}
</script>

<template>
  <combobox
    :model-value="item"
    :disabled="disabled"
    @update:model-value="onChange"
    as="div"
    class="relative">
    <div class="relative overflow-hidden">
      <combobox-input
        class="combobox-input"
        :display-value="(item) => item.label"
        @change="query = $event.target.value" />
      <combobox-button
        @click="showAllOptions"
        class="absolute inset-y-0 right-0 flex items-center pr-2">
        <chevron-down-icon class="w-4 h-4 ml-2" aria-hidden="true" />
      </combobox-button>
    </div>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
      @after-leave="query = ''">
      <combobox-options as="ul" class="dropdown-panel">
        <!-- <div
          v-if="filteredOptions.length === 0 && query !== ''"
          class="absolute inset-y-0 right-0 flex items-center px-4 py-2 pr-3 text-zinc-600"
        >
        Nothing found.
        </div> -->
        <template v-if="filteredOptions.length === 0 && query !== ''">
          <li class="truncate dropdown-option">
            <span>Nothing found.</span>
          </li>
        </template>
        <combobox-option
          as="template"
          v-for="option in filteredOptions"
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
            <span v-if="filteredOptions.length === 0 && query !== ''"> Nothing Found </span>
          </li>
        </combobox-option>
      </combobox-options>
    </transition>
  </combobox>
</template>
