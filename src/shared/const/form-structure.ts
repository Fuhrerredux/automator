import type { Node, Edge } from "@vue-flow/core";

export function convertToNode(node: Node): FocusTree.NodeWithId {
  return {
    id: node.id,
    type: node.type,
    data: node.data,
    position: node.position
  } as FocusTree.NodeWithId
}

export function convertToEdge(edge: Edge): FocusTree.EdgeWithId {
  return {
    id: edge.id,
    type: edge.type,
    source: edge.source,
    target: edge.target,
    label: edge.label
  } as FocusTree.EdgeWithId
}