<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
	title: string
	desc: string
	localise?: boolean
}>()

</script>

<template>
	<Disclosure v-slot="{ open }" as="div">
		<DisclosureButton 	
		class="flex w-full justify-between rounded-lg 
		bg-purple-100 px-4 py-2 text-left text-sm font-medium 
		text-purple-900 hover:bg-purple-200 focus:outline-none 
		focus-visible:ring focus-visible:ring-purple-500/75"
		>
			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-out"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			/>
			<span>{{ props.localise ? t(props.title) : props.title }}</span>
			<chevron-right-icon class="h-5 w-5 ui-open:rotate-90 ui-open:transform" />
		</DisclosureButton>
		<DisclosurePanel class="px-4 pb-2 pt-4 text-sm text-gray-500">
			{{ props.localise ? t(props.desc) : props.desc }}
		</DisclosurePanel>
	</Disclosure>
</template>