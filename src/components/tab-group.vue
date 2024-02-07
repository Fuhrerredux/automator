<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

defineProps<{ tabs: UserInterface.TabData[] }>()

const { t } = useI18n()
</script>

<template>
  <tab-group>
    <tab-list
      class="inline-flex items-center mb-2 gap-2 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-700 p-1">
      <tab v-for="tab in tabs" v-slot="{ selected }" as="template">
        <button
          type="button"
          class="px-2 py-1.5 font-medium rounded-lg"
          :class="selected ? 'bg-white dark:bg-zinc-900 shadow' : 'text-zinc-500'">
          <span>{{ t(tab.label) }}</span>
        </button>
      </tab>
    </tab-list>
    <tab-panels>
      <tab-panel v-for="tab in tabs">
        <component :is="tab.panel" />
      </tab-panel>
    </tab-panels>
  </tab-group>
</template>
