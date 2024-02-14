import { deserializeObject, serializeObject } from '@/shared/core/data'
import { invoke } from '@tauri-apps/api/tauri'

const keys: (keyof Character)[] = ['leaderRoles', 'commanderTraits', 'advisorRoles', 'roles']

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
  const characters = await invoke<CharacterWithId[]>('list_characters', {
    params: { page: 1, charactersPerPage: 100 }
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
  findById
}
export default characterRepository
