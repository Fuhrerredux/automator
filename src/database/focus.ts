import { deserializeObject, serializeObject } from '@/shared/core/data'
import { invoke } from '@tauri-apps/api/tauri'

const keys: (keyof FocusTree.Focus)[] = ['relatives', 'prerequisites', 'exclusives', 'position', 'cost']

async function create(focus: FocusTree.FocusWithId) {
  return invoke<Tauri.Broadcast>('create_focus', {
    form: serializeObject(focus, keys)
  })
}

async function update(id: String, focus: FocusTree.FocusWithId) {
  return invoke<Tauri.Broadcast>('update_focus', {
    id,
    form: serializeObject(focus, keys)
  })
}

async function remove(id: string) {
  return invoke<Tauri.Broadcast>('delete_focus', {
    id
  })
}

async function purge() {
  return invoke<Tauri.Broadcast>('purge_focuses')
}

async function findAll(): Promise<FocusTree.FocusWithId[]> {
  const focuses = await invoke<FocusTree.FocusWithId[]>('list_all_focuses')
  return focuses.map((focus) => deserializeObject(focus, keys)) as FocusTree.FocusWithId[]
}

async function list(page: number = 1, limit: number = 10): Promise<FocusTree.FocusWithId[]> {
  const focuses = await invoke<FocusTree.FocusWithId[]>('list_focuses', {
    page,
    limit
  })
  return focuses.map((focus) => deserializeObject(focus, keys)) as FocusTree.FocusWithId[]
}

async function findById(id: string): Promise<FocusTree.FocusWithId> {
  const focus = await invoke<FocusTree.FocusWithId>('get_focus', {
    params: { id }
  })
  return deserializeObject(focus, keys)
}

const focusRepository = {
  create,
  update,
  remove,
  purge,
  findAll,
  findById,
  list
}
export default focusRepository
