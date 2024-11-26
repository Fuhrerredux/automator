 import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import useNodeStore from '@/stores/nodes'

let id: number | null = null
// the operand of a decrement/increment operator must be a variable or a property access
const getId = () => `node_${(id = (id ?? useNodeStore().getId) + 1 - 1 + 1)}`

const state: UserInterface.DragAndDropState = {
  draggedType: ref<string | null>(null),
  isDragOver: ref<boolean>(false),
  isDragging: ref<boolean>(false),
}

const editingState: UserInterface.NodeEditingState = {
  editingNodeId: ref<string | null>(null),
  editingText: ref<string>('')
}

/**
 * Custom hook to handle drag and drop operations within Vue Flow.
 * @returns Object containing drag-and-drop handlers and state.
 */
export function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging } = state
  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()
  
  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event: DragEvent, type: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

    document.addEventListener('drop', onDragEnd)
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function onDragEnd() {
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  function onDrop(event: DragEvent) {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getId()

    const newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
      data: { label: nodeId },
    }

    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
      }))

      off()
    })

    addNodes(newNode)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}

/**
 * Custom hook to handle node property modifications like label editing.
 * @returns Object containing methods and state for editing nodes.
 */
export function useNodeProperties() {
  const { updateNode } = useVueFlow();
  const { editingNodeId, editingText } = editingState



  // Handle double-click to start editing a node's label
  function onDoubleClick(nodeId: string, currentText: string) {
    editingNodeId.value = nodeId;
    editingText.value = currentText;
  }

  // Save the edited label to the node
  function saveNodeText(nodeId: string) {
    updateNode(nodeId, (node) => ({
      ...node,
      data: { ...node.data, label: editingText.value },
    }));
    editingNodeId.value = null;
  }

  return {
    editingNodeId,
    editingText,
    onDoubleClick,
    saveNodeText,
  };
}