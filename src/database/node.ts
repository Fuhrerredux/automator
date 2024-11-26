import { deserializeObject, serializeObject } from '@/shared/core/data'
import { invoke } from '@tauri-apps/api/tauri'

const nodeKeys: (keyof FocusTree.NodeWithId)[] = ['id', 'data', 'position', 'type']
const edgeKeys: (keyof FocusTree.EdgeWithId)[] = ['id', 'source', 'target', 'label', 'type']

async function create(node: FocusTree.NodeWithId) {
  return invoke<Tauri.Broadcast>('create_node', {
    form: serializeObject(node, nodeKeys)
  })
}

async function update(id: String, node: FocusTree.NodeWithId) {
  return invoke<Tauri.Broadcast>('update_node', {
    id,
    form: serializeObject(node, nodeKeys)
  })
}

async function remove(id: string) {
  return invoke<Tauri.Broadcast>('delete_node', {
    id
  })
}

async function purge() {
  return invoke<Tauri.Broadcast>('purge_nodes')
}

async function findAll(): Promise<FocusTree.NodeWithId[]> {
  const nodes = await invoke<FocusTree.NodeWithId[]>('list_all_nodes')
  return nodes.map((focus) => deserializeObject(focus, nodeKeys)) as FocusTree.NodeWithId[]
}

// async function list(page: number = 1, limit: number = 10): Promise<FocusTree.NodeWithId[]> {
//   const nodes = await invoke<FocusTree.NodeWithId[]>('list_nodes', {
//     page,
//     limit
//   })
//   return nodes.map((node) => deserializeObject(node, nodeKeys)) as FocusTree.NodeWithId[]
// }

async function findById(id: string): Promise<FocusTree.NodeWithId> {
  const node = await invoke<FocusTree.NodeWithId>('get_node', {
    params: { id }
  })
  return deserializeObject(node, nodeKeys)
}

async function getCount(): Promise<number> {
  return await invoke<number>('get_node_count')
}

// Edge Functions
async function createEdge(edge: FocusTree.EdgeWithId) {
  return invoke<Tauri.Broadcast>('create_edge', {
    form: serializeObject(edge, edgeKeys)
  })
}

async function updateEdge(id: string, edge: FocusTree.EdgeWithId) {
  return invoke<Tauri.Broadcast>('update_edge', {
    id,
    form: serializeObject(edge, edgeKeys)
  })
}

async function removeEdge(id: string) {
  return invoke<Tauri.Broadcast>('delete_edge', { id })
}

async function purgeEdges() {
  return invoke<Tauri.Broadcast>('purge_edges')
}

async function findAllEdges(): Promise<FocusTree.EdgeWithId[]> {
  const edges = await invoke<FocusTree.EdgeWithId[]>('list_all_edges')
  return edges.map((edge) =>
    deserializeObject(edge, edgeKeys)
  ) as FocusTree.EdgeWithId[]
}

async function findEdgeById(id: string): Promise<FocusTree.EdgeWithId> {
  const edge = await invoke<FocusTree.EdgeWithId>('get_edge', { id })
  return deserializeObject(edge, edgeKeys)
}

async function findEdgesBySource(sourceId: string): Promise<FocusTree.EdgeWithId[]> {
  const edges = await invoke<FocusTree.EdgeWithId[]>(
    'get_edge_by_source',
    { sourceId }
  )
  return edges.map((edge) =>
    deserializeObject(edge, edgeKeys)
  ) as FocusTree.EdgeWithId[]
}

async function findEdgesByTarget(targetId: string): Promise<FocusTree.EdgeWithId[]> {
  const edges = await invoke<FocusTree.EdgeWithId[]>(
    'get_edge_by_target',
    { targetId }
  )
  return edges.map((edge) =>
    deserializeObject(edge, edgeKeys)
  ) as FocusTree.EdgeWithId[]
}

export const NodeRepository = {
  create: create,
  update: update,
  remove: remove,
  purge: purge,
  findAll: findAll,
  findById: findById,
  getCount: getCount
}

export const EdgeRepository = {
  create: createEdge,
  update: updateEdge,
  remove: removeEdge,
  purge: purgeEdges,
  findAll: findAllEdges,
  findById: findEdgeById,
  findBySource: findEdgesBySource,
  findByTarget: findEdgesByTarget
}
