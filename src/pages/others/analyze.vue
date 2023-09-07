<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useModStore from '@/stores/mod'
import AnalyzeTable from '@components/analyze-table/table.vue'
import FileSelectModal from '@components/file-select-modal.vue'
import AppHeader from '@components/header.vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import types from '@shared/const/sprites'
import { readSpriteUsage } from '@shared/core/reader'
import useSpriteDefinitions from '@stores/definitions'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const type = ref<string>('')
const open = ref(false)
const sprites = ref<string[]>([])
const parsedType = ref<SpriteType | null>(null)
const data = ref<AnalyzeData[]>([])
const modStore = useModStore()
const { unique, findDuplicates, importToFiles } = useSpriteDefinitions()

onMounted(async () => {
  await router.isReady()
  const routeType = route.query.type

  if (routeType && typeof routeType === 'string') {
    type.value = routeType

    const spriteType = types.find((e) => e.value.type === routeType)
    if (spriteType) {
      parsedType.value = spriteType.value
      sprites.value = await readSpriteUsage(spriteType.value, modStore.directory)
    }
  }
})

async function handleFileChanged(files: File[]) {
  if (!parsedType.value) return

  await importToFiles(files)
  findDuplicates()

  data.value = sprites.value.map((e) => {
    const sprite = unique.find((u) => u.name === e)

    return {
      sprite: e,
      path: sprite ? sprite.path : null,
      status: !sprite ? 'undef' : sprite.exists ? 'missing' : 'good'
    }
  }) as AnalyzeData[]
  open.value = false
}
</script>

<template>
  <app-header title="route.analyze-sprites">
    <button type="button" class="button-primary flex items-center" @click="open = true">
      <arrow-path-icon class="h-5 w-5 mr-2" />
      <span>{{ t('action.load') }}</span>
    </button>
  </app-header>
  <main class="content px-8 page">
    <analyze-table :data="data" />
  </main>
  <file-select-modal multiple :open="open" @hide="open = false" @select="handleFileChanged" />
</template>
