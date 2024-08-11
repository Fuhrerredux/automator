import { deserializeObject, serializeObject } from '@/shared/core/data'
import { invoke } from '@tauri-apps/api/tauri'

const keys: (keyof Character)[] = ['leaderRoles', 'commanderRoles', 'advisorRoles', 'roles']

async function create(character: CharacterWithId) {
  return invoke<Tauri.Broadcast>('create_character', {
    form: serializeObject(character, keys)
  })
}

async function update(id: String, character: CharacterWithId) {
  return invoke<Tauri.Broadcast>('update_character', {
    id,
    form: serializeObject(character, keys)
  })
}

async function remove(id: string) {
  return invoke<Tauri.Broadcast>('delete_character', {
    id
  })
}

async function purge() {
  return invoke<Tauri.Broadcast>('purge_characters')
}

async function findAll(): Promise<CharacterWithId[]> {
  const characters = await invoke<CharacterWithId[]>('list_all_characters')
  return characters.map((char) => deserializeObject(char, keys)) as CharacterWithId[]
}

async function list(page: number = 1, limit: number = 10): Promise<CharacterWithId[]> {
  const characters = await invoke<CharacterWithId[]>('list_characters', {
    page,
    limit
  })
  return characters.map((char) => deserializeObject(char, keys)) as CharacterWithId[]
}

async function findById(id: string): Promise<CharacterWithId> {
  const character = await invoke<CharacterWithId>('get_character', {
    params: { id }
  })
  return deserializeObject(character, keys)
}

const characterRepository = {
  create,
  update,
  remove,
  purge,
  findAll,
  findById,
  list
}
export default characterRepository
