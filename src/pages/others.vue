<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CharacterLocalisation from '@/components/others/character-localisation.vue'
import EventLogger from '@/components/others/event-logger.vue'
import LogRemover from '@/components/others/log-remover.vue'
import CharacterRecruit from '@components/others/character-recruit.vue'
import spriteFixer from '@components/others/fix-sprites.vue'
import OptimizeGfx from '@components/others/optimize-gfx.vue'
import ShineGeneration from '@components/others/shine-generation.vue'
import Page from '@components/page.vue'

const { t } = useI18n()
</script>

<template>
  <page>
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.others') }}</h1>
    </div>
    <div class="mt-4">
      <!-- GFX Optimization -->
      <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-md p-4 mt-4 hover:border-2 dark:hover:border-zinc-700">
        <h2 class="text-lg font-semibold mb-2">GFX Optimization</h2>
        <ul class="space-y-4">
          <shine-generation />
          <spriteFixer />
          <optimize-gfx />
        </ul>
      </div>
      
      <!-- Character Management -->
      <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-md p-4 mt-4 hover:border-2 hover:border-gray-200 dark:hover:border-zinc-700">
        <h2 class="text-lg font-semibold mb-2">Character Management</h2>
        <ul class="space-y-4">
          <character-recruit />
          <character-localisation />
        </ul>
      </div>
      
      <!-- Event Handling -->
      <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-md p-4 mt-4 hover:border-2 dark:hover:border-zinc-700">
        <h2 class="text-lg font-semibold mb-2">Event Handling</h2>
        <ul class="space-y-4">
          <log-remover />
          <event-logger />
        </ul>
      </div>
    </div>
  </page>
</template>


