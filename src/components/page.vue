<script setup lang="ts">
import Navigation from '@components/navigation.vue'
</script>

<template>
  <navigation />
  <main class="content px-8 page flex-1 flex flex-col w-full">
    <slot />
  </main>
</template>
