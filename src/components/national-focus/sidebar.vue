<script setup lang="ts">
import { useDragAndDrop } from '@/shared/utils/vueFlow';

const { onDragStart } = useDragAndDrop();
</script>

<template>
  <aside class="text-zinc-200 font-semibold border-r border-zinc-700 p-4 text-sm bg-zinc-900 shadow-md sm:min-w-[25%] rounded-l-lg">
    <div class="mb-4 text-base">You can drag these nodes to the pane:</div>

    <div class="flex flex-col gap-3 cursor-pointer">
      <div 
        class="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-all flex items-center justify-center"
        :draggable="true" 
        @dragstart="onDragStart($event, 'input')"
      >
        Input Node
      </div>

      <div 
        class="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-all flex items-center justify-center"
        :draggable="true" 
        @dragstart="onDragStart($event, 'default')"
      >
        Default Node
      </div>

      <div 
        class="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-all flex items-center justify-center"
        :draggable="true" 
        @dragstart="onDragStart($event, 'output')"
      >
        Output Node
      </div>

      <div 
        class="p-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-all flex items-center justify-center"
        :draggable="true" 
        @dragstart="onDragStart($event, 'labelInput')"
      >
        Label Node
      </div>
    </div>
  </aside>
</template>
