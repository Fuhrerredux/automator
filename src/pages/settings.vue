<script setup lang="ts">

    import Page from '@components/page.vue'
    import { useI18n } from 'vue-i18n'
    import useSettingsStore from '@/stores/settings'
    import SwitchButton from '@components/switch.vue'

    const { t } = useI18n()
    const settingsStore = useSettingsStore()

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
                    :checked="settingsStore.getPositionPrevention()"
                    :label="t('settings.positionPrevention')"
                    @update:model-value="settingsStore.togglePositionPrevention"
                />
                <div class="border-t dark:border-t-zinc-600 py-4 gap-4"></div>
                <label class="border-b dark:border-t-zinc-600 text-xl">Logging Settings</label>
                <br>
                <switch-button
                    :checked="settingsStore.getOptionLogging()"
                    :label="t('settings.optionLogging')"
                    @update:model-value="settingsStore.toggleOptionLogging"
                />
                <div class="border-t dark:border-t-zinc-600 py-4 gap-4"></div>
            </div>
        </div>
    </page>
</template>