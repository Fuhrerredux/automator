<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DuplicateTable from '@components/duplicate-table.vue'
import useSpriteDefinitionsStore from '@stores/definitions'

const spriteDefinitionsStore = useSpriteDefinitionsStore()
const { duplicates } = storeToRefs(spriteDefinitionsStore)
</script>

<template>
  <duplicate-table :duplicates="duplicates" />
</template>
