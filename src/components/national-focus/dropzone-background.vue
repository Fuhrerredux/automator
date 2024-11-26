<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>

<template>
  <div class="dropzone-background relative h-full w-full">
    <Background :size="2" :gap="20" pattern-color="#BDBDBD" variant="dots" />

    <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <slot />
    </div>
  </div>
</template>
