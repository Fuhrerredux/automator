<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useDragAndDrop } from '@/shared/utils/vueFlow'
import { NodeProps, VueFlow, useVueFlow, type Node, type Edge, GraphNode } from '@vue-flow/core'
import DropzoneBackground from './dropzone-background.vue'
import sidebar from './sidebar.vue'
import CustomNode from './nodes.vue'
import useFocusStore from '@/stores/focuses'
import useNodeStore from '@/stores/nodes'
// import { storeToRefs } from 'pinia'
// import router from '@/router'

// const focusStore = useFocusStore()
const nodeStore = useNodeStore()

// const { nodes, edges } = storeToRefs(nodeStore)
// const { focuses } = storeToRefs(focusStore)
// const { nodes, connections } = storeToRefs(nodeStore)
const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
// const focusRef = ref<FocusTree.FocusWithId | null>(null)
// const confirm = ref(false)

// const onCreateFocus = () => router.push('/edit')
// const onUpdateFocus = (focus: FocusTree.FocusWithId) => router.push(`/edit?focusId=${focus.id}`)
// const onRemoveCharacter = (focus: FocusTree.FocusWithId) => {
//   focusRef.value = focus
//   confirm.value = true
// }
// let nodes = ref<Node[]>([])
// let edges = ref<Edge[]>([])

onMounted(async () => {
  // nodeStore.refresh()
  nodeStore.fetch()

  // nodes.value = nodeStore.nodes
  // edges.value = nodeStore.edges
  // nodes.value = [
  //   {
  //     id: '1',
  //     data: { label: 'Node 1'} ,
  //     position: { x: 100, y: 100 }
  //   },
  //   {
  //     id: '2',
  //     data: { label: 'Node 2' },
  //     position: { x: 200, y: 200 }
  //   },
  //   {
  //     id: '3',
  //     data: { label: 'Node 3' },
  //     position: { x: 300, y: 300 }
  //   }
  // ]
  // edges.value = [
  //   {
  //     id: '1-2',
  //     source: '1',
  //     target: '2'
  //   },
  //   {
  //     id: '2-3',
  //     source: '2',
  //     target: '3'
  //   }
  // ]
})

                    //nNodes
function onNodesChange(_: FocusTree.NodeWithId[]) {
  // const uNodes = nNodes.map((node: Node) => {
  //   return {
  //     id: node.id,
  //     data: { label: node.label },
  //     position: node.position,
  //     type: node.type
  //   }
  // }) as FocusTree.NodeWithId[]
  // console.log(uNodes)
  // nodeStore.saveNodes(uNodes)
  nodeStore.save()
}
                    //nEdges
function onEdgeChange(_: FocusTree.EdgeWithId[]) {
  // const uEdges = nEdges.map((edge) => {
  //   return {
  //     id: edge.id,
  //     source: edge.source,
  //     target: edge.target,
  //     label: edge.label,
  //     type: edge.type
  //   }
  // })
  // console.log(uEdges)
  // nodeStore.saveEdges(uEdges)
  nodeStore.save()
}

// function convertNode(rawNode: Node): FocusTree.NodeWithId{
//   return {
//     id: rawNode.id,
//     data: { label: rawNode.data.label },
//     position: { x: rawNode.position.x, y: rawNode.position.y },
//     type: rawNode.type
//   }
// }

onConnect((params) => addEdges(params))


</script>


<template>
  <div class="dnd-flow flex flex-col h-full sm:flex-row text-[#2c3e50]" @drop="onDrop">
    <VueFlow
      v-model:nodes="nodeStore.nodes"
      v-model:edges="nodeStore.edges"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @nodesChange="onNodesChange"
      @edgesChange="onEdgeChange"
      snap-to-grid
      delete-key-code="Delete"
      multi-selection-key-code="Ctrl"
      :snapGrid="[20, 20]"
      fit-view-on-init
      :default-viewport="{ zoom: 3, x: 0, y: 0 }"
      :node-extent="[
        [Number.NEGATIVE_INFINITY, 0],
        [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
      ]"
      >
      <template #node-labelInput="props: NodeProps">
        <CustomNode v-bind="props" />
      </template>
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? 'text-gray-900' : 'transparent',
          transition: 'background-color 0.2s ease'
        }">
        <p v-if="isDragOver">Drop here</p>
      </DropzoneBackground>
    </VueFlow>
    <sidebar />
  </div>
</template>
