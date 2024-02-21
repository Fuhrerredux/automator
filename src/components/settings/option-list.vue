<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PreferenceGroup from '@components/settings/preference-group.vue'

defineProps<{
    title: string
}>()

const { t } = useI18n()
</script>
<template>
    <preference-group :title="t(title)">
        <ul class="space-y-4">
            <slot />
        </ul>
    </preference-group>
</template>