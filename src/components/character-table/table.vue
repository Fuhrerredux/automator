<script setup lang="ts">
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from '@/components/data-table.vue'
import useConfiguration from '@/stores/config'
import RolesViewer from '@components/roles-viewer.vue'
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable
} from '@tanstack/vue-table'
import Actions from './actions.vue'

const { t } = useI18n()
const {
  config: { ideologies }
} = useConfiguration()
type CharacterTableProps = {
  characters: CharacterWithId[]
}
type CharacterTableEmits = {
  (e: 'update', value: CharacterWithId): void
  (e: 'remove', value: CharacterWithId): void
}

const props = defineProps<CharacterTableProps>()
const emits = defineEmits<CharacterTableEmits>()

const defineColumns = (): ColumnDef<CharacterWithId>[] => {
  const updateFn = (c: CharacterWithId) => emits('update', c)
  const removeFn = (c: CharacterWithId) => emits('remove', c)

  return [
    {
      header: () => t('field.tag'),
      accessorKey: 'tag'
    },
    {
      header: () => t('field.name'),
      accessorKey: 'name'
    },
    {
      id: 'Ideology',
      header: () => t('field.ideology'),
      accessorFn: (row) => (row.ideology ? ideologies[row.ideology].name : '')
    },
    {
      id: 'Roles',
      header: () => t('field.roles'),
      cell: ({ row }) => {
        const character = row.original
        return h(RolesViewer, { positions: character.advisorRoles })
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const character = row.original
        return h(Actions, { character, onUpdate: updateFn, onRemove: removeFn })
      }
    }
  ]
}

const table = useVueTable({
  data: props.characters,
  columns: defineColumns(),
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel()
})
</script>

<template>
  <DataTable :definition="table" />
</template>
