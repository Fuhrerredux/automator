<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import ActionItem from '@components/action-item.vue'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { exportShine } from '@shared/core/writer'
import useModStore from '@stores/mod'

const store = useModStore()
const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)
const finished = ref(false)

async function generate() {
  try {
    loading.value = true
    await exportShine(`${store.directory}/interface`)
    $toast.success(t('status.shines-generated'))
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
    @action="generate">
    <template #icon>
      <bolt-icon class="h-6 w-6" />
    </template>
  </action-item>
</template>
