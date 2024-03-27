<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { readFileObject } from '@/shared/utils/reader'
import ActionItem from '@components/action-item.vue'
import FileSelectModal from '@components/modal/file-select-modal.vue'
import { DocumentMinusIcon } from '@heroicons/vue/24/outline'
import { removeLogging } from '@shared/core/writer'
import { save } from '@tauri-apps/api/dialog'

const $toast = useToast()
const { t } = useI18n()
const loading = ref(false)
const open = ref(false)
const finished = ref(false)

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
      await removeLogging(content, filePath)
      $toast.success(t('status.log-removed'))
    } else {
      $toast.error(t('error.select-destination-folder'))
    }
  } catch (error) {
    console.error(error)
    console.error(error)
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
    :title="t('others.logremoving.heading')"
    :summary="t('others.logremoving.summary')"
    :loading="loading"
    :finished="finished"
    @action="open = true">
    <template #icon>
      <document-minus-icon class="h-6 w-6" />
    </template>
  </action-item>
  <file-select-modal :open="open" @hide="open = false" @select="generate" />
</template>
