<script setup lang="ts">
import {
  DialogDescription,
  DialogPanel,
  Dialog as DialogRoot,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

defineProps({
  open: Boolean,
  hideable: Boolean,
  size: String
})
defineEmits(['hide'])
</script>

<template>
  <transition-root :show="open" as="template">
    <dialog-root as="div" class="relative z-10" @close="hideable && $emit('hide')">
      <transition-child
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25"></div>
      </transition-child>

      <div class="fixed inset-0 overflow-y-auto font-primary">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <transition-child
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <dialog-panel
              class="z-30 w-full transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:bg-zinc-800 dark:text-zinc-50"
              :class="size ? size : 'max-w-md'">
              <button
                type="button"
                class="absolute right-0 top-0 m-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                @click="$emit('hide')">
                <span class="sr-only">Close</span>
                <x-mark-icon class="h-5 w-5 text-zinc-500" />
              </button>
              <div class="px-6 pt-6">
                <dialog-title
                  as="h3"
                  class="mb-0.5 text-lg font-bold leading-6 text-zinc-700 dark:text-zinc-50">
                  <slot name="title"></slot>
                </dialog-title>
                <dialog-description class="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <slot name="description"></slot>
                </dialog-description>
              </div>
              <div class="mx-6 mt-4">
                <slot name="body"></slot>
              </div>
            </dialog-panel>
          </transition-child>
        </div>
      </div>
    </dialog-root>
  </transition-root>
</template>
