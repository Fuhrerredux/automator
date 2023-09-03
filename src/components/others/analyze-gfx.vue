<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import ActionItem from '@components/action-item.vue'
import FileSelectModal from '@components/file-select-modal.vue'
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import useSpriteDefinitionsStore from '@stores/definitions'
import useModStore from '@stores/mod'

const { t } = useI18n()
const open = ref(false)
const loading = ref(false)
const modStore = useModStore()
const { importToFiles, findDuplicates, checkExistence, findOrphaned } = useSpriteDefinitionsStore()

async function handleFileSelection(files: File[]) {
  loading.value = true
  try {
    await importToFiles(files)
    await checkExistence(modStore.directory)
    findDuplicates()
    await findOrphaned(modStore.directory)

    router.push('/analyze')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <action-item
    :title="t('others.analyze-gfx.heading')"
    :summary="t('others.analyze-gfx.summary')"
    :loading="false"
    :finished="false"
    @action="open = true">
    <template #icon>
      <document-duplicate-icon class="h-6 w-6" />
    </template>
  </action-item>
  <file-select-modal multiple :open="open" @hide="open = false" @select="handleFileSelection" />
</template>
