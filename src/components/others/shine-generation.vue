<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import ActionItem from '@components/action-item.vue'
import FileSelectModal from '@components/file-select-modal.vue'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { exportShine } from '@shared/core/writer'
import { readFileObject } from '@shared/utils/reader'
import useModStore from '@stores/mod'
import { save } from '@tauri-apps/api/dialog'

const store = useModStore()
const { t } = useI18n()
const $toast = useToast()
const open = ref(false)
const loading = ref(false)
const finished = ref(false)

async function generate(files: File[]) {
  open.value = false
  if (files.length <= 0) return

  try {
    loading.value = true
    const selected = files[0]
    const fileName = selected.name
    const name = fileName.substring(0, fileName.lastIndexOf('.'))

    const content = await readFileObject(selected)
    const filePath = await save({
      defaultPath: `${store.directory}/interface/${name}_shine.gfx`
    })

    if (filePath) {
      await exportShine(content, filePath)
      $toast.success(t('status.shines-generated'))
    } else {
      $toast.error(t('error.select-destination-folder'))
    }
  } catch (e) {
    $toast.error(String(e))
  } finally {
    loading.value = false
    finished.value = true
  }
}
</script>

<template>
  <action-item
    :title="t('others.shine.heading')"
    :summary="t('others.shine.summary')"
    :loading="loading"
    :finished="finished"
    @action="open = true">
    <template #icon>
      <bolt-icon class="h-6 w-6" />
    </template>
  </action-item>
  <file-select-modal :open="open" @hide="open = false" @select="generate" />
</template>
