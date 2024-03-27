<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import ActionItem from '@components/action-item.vue'
import FileSelectModal from '@components/modal/file-select-modal.vue'
import { Bars3BottomRightIcon } from '@heroicons/vue/24/outline'
import { appendCharacterLocalisation } from '@shared/core/writer'
import { readFileObject } from '@shared/utils/reader'
import useCharacterStore from '@stores/characters'
import useModStore from '@/stores/mod'
import { save } from '@tauri-apps/api/dialog'

const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)
const finished = ref(false)
const characterStore = useCharacterStore()
const modStore = useModStore()
const open = ref(false)

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
      await appendCharacterLocalisation(characterStore.characters, filePath, content, modStore.getCommonDirectory?.path as string)
      $toast.success(t('status.characters-localised'))
    } else {
      $toast.error(t('error.select-destination-folder'))
    }
  } catch (error) {
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
    :title="t('others.character-localisation.heading')"
    :summary="t('others.character-localisation.summary')"
    :loading="loading"
    :finished="finished"
    @action="open = true">
    <template #icon>
      <bars3-bottom-right-icon class="h-6 w-6" />
    </template>
  </action-item>
  <file-select-modal :open="open" @hide="open = false" @select="generate" />
</template>
