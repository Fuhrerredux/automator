import { deserializeObject, serializeObject } from '@/shared/core/data'
import { invoke } from '@tauri-apps/api/tauri'

const nodeKeys: (keyof FocusTree.Node)[] = ['data', 'position', 'type', 'label']
const connectionKeys: (keyof FocusTree.Connection)[] = ['source', 'target', 'sourceHandle', 'targetHandle']

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

async function list(page: number = 1, limit: number = 10): Promise<FocusTree.NodeWithId[]> {
  const nodes = await invoke<FocusTree.NodeWithId[]>('list_nodes', {
    page,
    limit
  })
  return nodes.map((node) => deserializeObject(node, nodeKeys)) as FocusTree.NodeWithId[]
}

async function findById(id: string): Promise<FocusTree.NodeWithId> {
  const node = await invoke<FocusTree.NodeWithId>('get_node', {
    params: { id }
  })
  return deserializeObject(node, nodeKeys)
}

// Connection Functions
async function createConnection(connection: FocusTree.ConnectionWithId) {
  return invoke<Tauri.Broadcast>('create_connection', {
    form: serializeObject(connection, connectionKeys)
  })
}

async function updateConnection(id: string, connection: FocusTree.ConnectionWithId) {
  return invoke<Tauri.Broadcast>('update_connection', {
    id,
    form: serializeObject(connection, connectionKeys)
  })
}

async function removeConnection(id: string) {
  return invoke<Tauri.Broadcast>('delete_connection', { id })
}

async function purgeConnections() {
  return invoke<Tauri.Broadcast>('purge_connections')
}

async function findAllConnections(): Promise<FocusTree.ConnectionWithId[]> {
  const connections = await invoke<FocusTree.ConnectionWithId[]>('list_all_connections')
  return connections.map((connection) =>
    deserializeObject(connection, connectionKeys)
  ) as FocusTree.ConnectionWithId[]
}

async function findConnectionById(id: string): Promise<FocusTree.ConnectionWithId> {
  const connection = await invoke<FocusTree.ConnectionWithId>('get_connection', { id })
  return deserializeObject(connection, connectionKeys)
}

async function findConnectionsBySource(sourceId: string): Promise<FocusTree.ConnectionWithId[]> {
  const connections = await invoke<FocusTree.ConnectionWithId[]>(
    'get_connections_by_source',
    { sourceId }
  )
  return connections.map((connection) =>
    deserializeObject(connection, connectionKeys)
  ) as FocusTree.ConnectionWithId[]
}

async function findConnectionsByTarget(targetId: string): Promise<FocusTree.ConnectionWithId[]> {
  const connections = await invoke<FocusTree.ConnectionWithId[]>(
    'get_connections_by_target',
    { targetId }
  )
  return connections.map((connection) =>
    deserializeObject(connection, connectionKeys)
  ) as FocusTree.ConnectionWithId[]
}

export const NodeRepository = {
  create: create,
  update: update,
  remove: remove,
  purge: purge,
  findAll: findAll,
  list: list,
  findById: findById
}

export const ConnectionRepository = {
  create: createConnection,
  update: updateConnection,
  remove: removeConnection,
  purge: purgeConnections,
  findAll: findAllConnections,
  findById: findConnectionById,
  findBySource: findConnectionsBySource,
  findByTarget: findConnectionsByTarget
}
