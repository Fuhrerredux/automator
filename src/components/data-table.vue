<script setup lang="ts" generic="T extends object">
import Pagination from '@/components/pagination.vue'
import { FlexRender, type Table } from '@tanstack/vue-table'

defineProps<{
  definition: Table<T>
}>()
</script>

<template>
  <div class="flex-1">
    <table>
      <thead>
        <tr v-for="headerGroup in definition.getHeaderGroups()" :key="headerGroup.id">
          <th v-for="header in headerGroup.headers" :key="header.id">
            <span v-if="header.isPlaceholder" />
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in definition.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <pagination :definition="definition" />
</template>
