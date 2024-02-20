<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { readFileObject } from '@/shared/utils/reader'
import ActionItem from '@components/action-item.vue'
import FileSelectModal from '@components/modal/file-select-modal.vue'
import { DocumentPlusIcon } from '@heroicons/vue/24/outline'
import { eventLogging } from '@shared/core/writer'
import { save } from '@tauri-apps/api/dialog'

const loading = ref(false)
const finished = ref(false)
const open = ref(false)
const { t } = useI18n()
const $toast = useToast()

async function generate(files: File[]) {
  open.value = false
  if (files.length <= 0) return
  try {
    loading.value = true
    const selected = files[0]
    const fileName = selected.name

    const content = await readFileObject(selected)
    const filePath = await save({
      defaultPath: `${fileName}`
    })

    if (filePath) {
      await eventLogging(content, filePath)
      $toast.success(t('status.event-logged'))
    } else {
      $toast.error(t('error.select-destination-folder'))
    }
  } catch (error) {
    console.log(error)
    console.log(error)
    $toast.error(String(error))
    throw error
  } finally {
    loading.value = false
    finished.value = true
  }
}
</script>
<template>
  <action-item
    :title="t('others.eventlogging.heading')"
    :summary="t('others.eventlogging.summary')"
    :loading="loading"
    :finished="finished"
    @action="open = true">
    <template #icon>
      <document-plus-icon class="h-6 w-6" />
    </template>
  </action-item>
  <file-select-modal :open="open" @hide="open = false" @select="generate" />
</template>
