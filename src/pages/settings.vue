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
            <section class="mt-4 space-y-4">
                <h2 class="text-sm font-medium uppercase">Character Settings</h2>
                <br>
                <switch-button
                  :checked="settingsStore.getPositionPrevention()"
                  :label="t('settings.positionPrevention')"
                  @update:model-value="settingsStore.togglePositionPrevention"
                />
                <div class="border-t dark:border-t-zinc-600 py-4 gap-4"></div>
                <h2 class="text-sm font-medium uppercase">Logging Settings</h2>
                <br>
                <switch-button
                  :checked="settingsStore.getOptionLogging()"
                  :label="t('settings.optionLogging')"
                  @update:model-value="settingsStore.toggleOptionLogging"
                />
                <div class="border-t dark:border-t-zinc-600 py-4 gap-4"></div>
                </section>
        </div>
    </page>
</template>
