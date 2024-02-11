<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import ActionItem from '@components/action-item.vue'
import { UserPlusIcon } from '@heroicons/vue/24/outline'
import { appendToHistory } from '@shared/core/writer'
import useCharacterStore from '@stores/characters'
import useModStore from '@stores/mod'

const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)
const finished = ref(false)
const characterStore = useCharacterStore()
const modStore = useModStore()

async function append() {
  try {
    loading.value = true
    await appendToHistory(characterStore.characters, modStore.directory)
    $toast.success(t('status.characters-exported'))
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
    :title="t('others.character-recruit.heading')"
    :summary="t('others.character-recruit.summary')"
    :loading="loading"
    :finished="finished"
    @action="append">
    <template #icon>
      <user-plus-icon class="h-6 w-6" />
    </template>
  </action-item>
</template>
