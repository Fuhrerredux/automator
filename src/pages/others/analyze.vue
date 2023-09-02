<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import AppHeader from '@components/header.vue'
import SpinnerButton from '@components/spinner-button.vue'
import TabGroup from '@components/tab-group.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import tabs from '@shared/const/tabs-analyze'
import { writeSprites } from '@shared/core/writer'
import { groupBy } from '@shared/utils/core'
import useSpriteDefinitionsStore from '@stores/definitions'
import useModStore from '@stores/mod'

const { t } = useI18n()
const $toast = useToast()
const store = useModStore()
const spriteDefinitionsStore = useSpriteDefinitionsStore()
const { duplicates } = storeToRefs(spriteDefinitionsStore)
const saving = ref(false)

function filter() {
  const base = 'FX_goals.gfx'
  const { unique } = spriteDefinitionsStore
  const grouped = groupBy(unique, 'file')
  const pruned: Map<string, Sprite[]> = new Map()
  const names = Array.from(duplicates.value.keys())

  pruned.set(base, grouped[base])
  for (const [key, value] of Object.entries(grouped)) {
    if (key === base) continue

    const filtered = value.filter((e) => !names.includes(e.name))
    pruned.set(key, filtered)
  }

  return pruned
}

async function handleImport() {
  saving.value = true

  try {
    const sprites = filter()
    for (const [key, value] of sprites) {
      const output = `${store.directory}/interface/${key}`
      await writeSprites(value, output)
    }

    $toast.success(t('status.characters-imported'))
  } catch (e) {
    $toast.error(String(e))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <app-header title="route.analyze-gfx">
    <spinner-button
      type="button"
      class="button-primary flex items-center"
      :loading="saving"
      @click="handleImport">
      <template #content>
        <check-icon class="h-5 w-5 mr-2" />
        <span>{{ t('action.save') }}</span>
      </template>
      <template #loading>
        <check-icon class="h-5 w-5 mr-2" />
        <span>{{ t('loading.saving') }}</span>
      </template>
    </spinner-button>
  </app-header>
  <main class="content px-8 page">
    <tab-group :tabs="tabs" />
  </main>
</template>
