<script setup lang="ts">

import { ref, computed } from 'vue';
import { Handle, Position, type NodeProps } from '@vue-flow/core';

const props = defineProps<NodeProps>();

const isEditing = ref(false);
const label = ref(props.data.label || 'Unnamed');

const handleDoubleClick = () => {
  isEditing.value = true;
};

const saveLabel = () => {
  isEditing.value = false;
  props.data.label = label.value;
};

const nodePosition = computed(() => {
  const { x, y } = props.position
  return `x: ${Math.round(x/50)}, y: ${Math.round(y/50)}`
})

</script>

<template>
  <Handle type="source" :position="Position.Top"/>
  <div @dblclick="handleDoubleClick" class="p-2 border border-gray-300 rounded-md text-center bg-white cursor-pointer w-[140px]">
    <input
      v-if="isEditing"
      v-model="label"
      @blur="saveLabel"
      @keyup.enter="saveLabel"
      type="text"
      class="w-full p-1.5 box-border"
    />
    <span v-else>{{ label }}</span>
    <div class="absolute bottom-0 left-0 w-full text-[10px] text-gray-900">
      {{ nodePosition }}
    </div>
  </div>
  <Handle type="target" :position="Position.Bottom"/>
</template>