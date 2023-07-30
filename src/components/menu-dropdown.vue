<script setup lang="ts">
import { MenuButton, MenuItems, Menu as MenuRoot } from '@headlessui/vue'
</script>

<template>
  <menu-root as="div" class="relative inline-block text-left">
    <menu-button
      class="inline-flex w-full justify-center rounded-md p-2 text-sm font-medium hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
        class="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <slot name="items"></slot>
      </menu-items>
    </transition>
  </menu-root>
</template>
