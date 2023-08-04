<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import localeSwitcher from '@components/navigation/locale-switcher.vue'
import ThemeSwitcher from '@components/navigation/theme-switcher.vue'

const { t } = useI18n()
const route = useRoute()

function isActive(link: string): string {
  return route.path === link ? 'text-zinc-800 dark:text-zinc-50' : ''
}
</script>

<template>
  <nav class="border-b bg-white dark:bg-zinc-800 dark:border-b-zinc-700 sticky top-0 z-10">
    <div class="content flex items-center justify-between px-8 py-2">
      <div class="font-bold">{{ t('app') }}</div>
      <div class="space-x-2 text-sm font-medium text-zinc-500">
        <router-link to="/" class="link" :class="isActive('/')">
          {{ t('route.main') }}
        </router-link>
        <router-link to="/characters" class="link" :class="isActive('/characters')">
          {{ t('route.characters') }}
        </router-link>
        <router-link to="/others" class="link" :class="isActive('/others')">
          {{ t('route.others') }}
        </router-link>
      </div>
      <div class="flex items-center gap-4">
        <locale-switcher />
        <theme-switcher />
      </div>
    </div>
  </nav>
</template>

<style scoped lang="postcss">
.link {
  @apply inline-block px-3 py-2;
}
</style>
