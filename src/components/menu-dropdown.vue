<script setup lang="ts">
import { MenuButton, MenuItems, Menu as MenuRoot } from '@headlessui/vue'

defineProps<{
  buttonClass?: string
}>()
</script>

<template>
  <menu-root as="div" class="relative inline-block text-left">
    <menu-button :class="buttonClass ?? 'menu-button'">
      <slot name="button"></slot>
    </menu-button>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0">
      <menu-items
        class="absolute right-0 mt-2 z-20 text-sm w-40 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-600 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-700">
        <slot></slot>
      </menu-items>
    </transition>
  </menu-root>
</template>
