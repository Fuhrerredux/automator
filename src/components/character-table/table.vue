<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CharacterRow from '@components/character-table/row.vue'

const { t } = useI18n()
defineProps<{ characters: CharacterWithId[] }>()
defineEmits<{
  (e: 'update', value: Character): void
  (e: 'remove', value: Character): void
}>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th scope="col" class="w-1/6">{{ t('field.tag') }}</th>
        <th scope="col" class="w-2/6">{{ t('field.name') }}</th>
        <th scope="col" class="w-3/6">{{ t('field.roles') }}</th>
        <th scope="col" class="w-1/6">
          <span class="sr-only">{{ t('field.actions') }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="character of characters" :key="character.id">
        <character-row :character="character" />
      </template>
    </tbody>
  </table>
</template>
