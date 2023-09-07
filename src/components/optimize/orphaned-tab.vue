<script setup lang="ts">
import { storeToRefs } from 'pinia'
import EntryTable from '@components/file-entry/table.vue'
import useSpriteDefinitionsStore from '@stores/definitions'

const spriteDefinitionsStore = useSpriteDefinitionsStore()
const { orphaned } = storeToRefs(spriteDefinitionsStore)
</script>

<template>
  <entry-table :entries="orphaned" />
</template>
