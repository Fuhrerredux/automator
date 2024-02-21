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
import PreferenceGroup from '@components/settings/preference-group.vue'
import OptionList from '@/components/settings/option-list.vue'

const { t } = useI18n()
</script>

<template>
  <page>
    <div class="flex items-center justify-between">
      <h1 class="header">{{ t('route.others') }}</h1>
    </div>
    <div class="mt-4 space-y-4">
      <!-- GFX Optimization -->
      <option-list title="sections.gfx-optimization">
        <shine-generation />
        <spriteFixer />
        <optimize-gfx />
      </option-list>
      <!-- Character Management -->
      <option-list title="sections.character-management">
        <character-recruit />
        <character-localisation />
      </option-list>
      <!-- Event Handling -->
      <option-list title="sections.event-handling">
        <log-remover />
        <event-logger />
      </option-list>
    </div>
  </page>
</template>
