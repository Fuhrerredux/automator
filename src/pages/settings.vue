<script setup lang="ts">

    import Page from '@components/page.vue'
    import { ref } from 'vue'
    import { useI18n } from 'vue-i18n'
    import useSettingsStore from '@/stores/settings'
    import SwitchButton from '@components/switch.vue'

    const { t } = useI18n()
    const settingsStore = useSettingsStore()
    const positionPrevention = ref(settingsStore.positionPrevention)

</script>

<template>
    <page>
        <div class="items-center justify-between flex-auto">
            <h1 class="header">{{ t('settings.header') }}</h1>
            <div><br></div>
            <div class="mt-4 space-y-4">
                <label class="border-b dark:border-t-zinc-600 text-xl">Character Settings</label>
                <br>
                <switch-button
                    :checked="positionPrevention"
                    :label="t('settings.positionPrevention')"
                    @update:model-value="positionPrevention = $event"
                />
                <div class="border-t dark:border-t-zinc-600 py-4 gap-4"></div>
            </div>
        </div>
    </page>
</template>