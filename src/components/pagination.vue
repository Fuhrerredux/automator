<script setup lang="ts" generic="T extends object">
import { useI18n } from 'vue-i18n'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { type Table } from '@tanstack/vue-table'

defineProps<{
  definition: Table<T>
}>()
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="space-x-2">
      <button
        type="button"
        class="button-secondary"
        :disabled="!definition.getCanPreviousPage()"
        @click="definition.previousPage()">
        <span class="sr-only">{{ t('action.previous') }}</span>
        <chevron-left-icon class="h-5 w-5" />
      </button>

      <button
        type="button"
        class="button-secondary"
        :disabled="!definition.getCanNextPage()"
        @click="definition.nextPage()">
        <span class="sr-only">{{ t('action.next') }}</span>
        <chevron-right-icon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
