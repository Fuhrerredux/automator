<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { ArrowSmallLeftIcon } from '@heroicons/vue/24/solid'

const { t } = useI18n()

defineProps<{
  title: string
}>()
</script>

<template>
  <nav class="border-b bg-white dark:bg-zinc-800 dark:border-b-zinc-700 sticky top-0 z-10">
    <div class="content flex items-center justify-between px-8 py-2">
      <div class="flex items-center gap-4">
        <button type="button" class="dropdown-button" @click="router.back">
          <arrow-small-left-icon class="h-6 w-6" />
        </button>
        <h1 class="font-semibold text-lg">{{ t(title) }}</h1>
      </div>

      <div>
        <slot></slot>
      </div>
    </div>
  </nav>
</template>
