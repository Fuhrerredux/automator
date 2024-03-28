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
    <div class="space-x-2 flex items-center justify-end">
      <button
        type="button"
        class="button-secondary flex items-center"
        :disabled="!definition.getCanPreviousPage()"
        @click="definition.previousPage()">
        <chevron-left-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.previous') }}</span>
      </button>

      <button
        type="button"
        class="button-secondary flex items-center"
        :disabled="!definition.getCanNextPage()"
        @click="definition.nextPage()">
        <span>{{ t('action.next') }}</span>
        <chevron-right-icon class="h-5 w-5 ml-2" />
      </button>
    </div>
  </div>
</template>
