<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@components/modal.vue'
import { open } from '@tauri-apps/api/dialog'

defineProps<{ 
	isOpen: boolean
}>()

const emit = defineEmits([
	'hide',
	'select'
])

const { t } = useI18n()
const loading = ref(false)

async function selectFolder() {
  try {
    const folderPath = await open({
      directory: true,
    })
    if (folderPath !== null) {
      emit('select', { folderPath })
    }
  } catch (error) {
    console.error('Error selecting folder:', error)
  }
}
</script>

<template>
  <modal :hideable="!loading" :open="isOpen" size="max-w-md" @hide="$emit('hide')">
    <template #title>
      {{ t('modal.folder-select.heading') }}
    </template>
    <template #description>
      {{ t('modal.folder-select.summary') }}
    </template>
    <template #body>
      <div>
        <div class="dialog-actions">
					<button type="button" class="button-primary" @click="selectFolder">
          {{ t('action.select_folder') }}
					</button>
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
        </div>
      </div>
    </template>
  </modal>
</template>