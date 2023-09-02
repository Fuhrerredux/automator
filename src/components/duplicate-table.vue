<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { InformationCircleIcon } from '@heroicons/vue/20/solid'

defineProps<{
  duplicates: Map<string, Sprite[]>
}>()

const { t } = useI18n()
</script>

<template>
  <div class="text-sm">
    <ul class="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <li v-for="[key, value] in duplicates" class="border dark:border-zinc-700 p-2 rounded-md">
        <span class="font-medium">{{ key }}</span>
        <ul class="flex flex-wrap items-center gap-2 mt-2">
          <li
            v-for="item in value"
            class="text-xs font-medium flex items-center px-3 py-1 rounded-full"
            :class="
              !item.exists
                ? 'bg-rose-50 text-rose-800 dark:bg-rose-800 dark:text-rose-200'
                : 'bg-zinc-100 dark:bg-zinc-500 text-zinc-800 dark:text-zinc-200'
            ">
            <span>{{ item.file }}</span>
            <information-circle-icon
              v-if="!item.exists"
              v-tippy="t('error.file-not-found')"
              class="h-4 w-4 ml-2" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
