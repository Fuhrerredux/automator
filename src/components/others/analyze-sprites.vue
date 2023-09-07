<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import ActionItem from '@components/action-item.vue'
import SpritePickerModal from '@components/sprite-picker-modal.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const open = ref(false)

function onSelect({ type }: SpriteType) {
  router.push(`/analyze?type=${type}`)
}
</script>

<template>
  <action-item
    :title="t('others.analyze-sprites.heading')"
    :summary="t('others.analyze-sprites.summary')"
    :loading="false"
    :finished="false"
    @action="open = true">
    <template #icon>
      <magnifying-glass-icon class="h-6 w-6" />
    </template>
  </action-item>
  <sprite-picker-modal :open="open" @hide="open = false" @select="onSelect" />
</template>
