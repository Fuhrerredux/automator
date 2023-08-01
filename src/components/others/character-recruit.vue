<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import ActionItem from '@components/action-item.vue'
import { UserIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const $toast = useToast()

async function append() {
  $toast.success('sucess!')
}
</script>

<template>
  <action-item
    :title="t('others.character-recruit.heading')"
    :summary="t('others.character-recruit.summary')"
    @action="append">
    <template #icon>
      <user-icon class="h-6 w-6" />
    </template>
  </action-item>
</template>
