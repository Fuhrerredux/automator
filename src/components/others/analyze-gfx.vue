<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionItem from '@components/action-item.vue'
import FileAddModal from '@components/file-add-modal.vue'
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const open = ref(false)

function triggerInput() {
  open.value = true
}
</script>

<template>
  <action-item
    :title="t('others.analyze-gfx.heading')"
    :summary="t('others.analyze-gfx.summary')"
    :loading="false"
    :finished="false"
    @action="triggerInput">
    <template #icon>
      <document-duplicate-icon class="h-6 w-6" />
    </template>
  </action-item>
  <file-add-modal :open="open" @hide="open = false" />
</template>
