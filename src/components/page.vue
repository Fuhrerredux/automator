<script setup lang="ts">
import Navigation from '@components/navigation.vue'
</script>

<template>
  <navigation />
  <main class="content px-8 page">
    <slot />
  </main>
</template>
