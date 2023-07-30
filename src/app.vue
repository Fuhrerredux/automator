<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from '@components/navigation.vue'
import useTheme from '@composables/use-theme'
import DatabaseController from '@database/controller'
import CharacterRepository from '@database/repository'

const characters = ref<CharacterWithId[]>([])
const database = DatabaseController.getInstance()
const controller = CharacterRepository.getInstance()

onMounted(async () => {
  await database.init()
  await refresh()
})

const { theme, change } = useTheme()
const refresh = async () => (characters.value = await controller.findAll())

provide('characters', { characters, refresh })
provide('theme', { theme, change })
</script>

<template>
  <navigation />
  <div class="content px-8">
    <router-view />
  </div>
</template>
