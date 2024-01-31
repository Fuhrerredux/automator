<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import Modal from '@components/modal.vue'
import { AdjustmentsHorizontalIcon } from "@heroicons/vue/24/outline"
import useSettingsStore from '@/stores/settings'
// import { storeToRefs } from 'pinia'
import SwitchButton from '@components/switch.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

const emit = defineEmits(['hide'])
const { t } = useI18n()
const $toast = useToast()
const loading = ref(false)
const settingsBool = ref(false)
const settingsStore = useSettingsStore()

const positionPrevention = ref(settingsStore.positionPrevention)
// const { change } = settingsStore

const { open } = defineProps<{
	open: boolean
}>()

function openSettingsModal() {
	settingsBool.value = true
}

async function submit() {
	try {
		settingsStore.updatePositionPrevention(positionPrevention.value)

		loading.value = true
		$toast.success(t('status.saved'))
		emit('hide')
	} catch (e) {
		$toast.error(String(e))
	} finally {
		loading.value = false
	}
}

</script>

<template>
	<div>
		<!-- Button to open Settings modal -->
		<button type="button" @click="openSettingsModal">
			<AdjustmentsHorizontalIcon class="h-6 w-6 text-gray-500" />
		</button>

		<!-- Settings modal using the modal.vue component -->
		<modal :hideable="false" :open="open" size="max-w-2xl" @hide="$emit('hide')">
			<template #title>
				<h3>{{ t('settings.header') }}</h3>
			</template>

			<template #body>
				<form @submit.prevent="submit">
					<switch-button
						:checked="positionPrevention"
						:label="t('settings.positionPrevention')"
						@update:model-value="positionPrevention = $event"
					/>
					<div class="dialog-actions">
						<button class="button-secondary" @click="$emit('hide')"> {{ t('action.cancel') }} </button>
						<button type="submit" class="button-primary" :loading="loading"> 
							{{ t('action.save') }}
						</button>
					</div>
				</form>
			</template>
		</modal>
	</div>
	<settings v-if="settingsBool" :open="settingsBool" @hide="settingsBool = false" />
</template>

