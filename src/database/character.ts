import { deserializeObject, serializeObject } from '@/shared/core/data'
import { invoke } from '@tauri-apps/api/tauri'

const keys: (keyof Character)[] = ['positions', 'leaderTraits', 'leaderIdeologies', 'commanderTraits', 'ministerTraits', 'officerTraits', 'roles']
async function create(character: CharacterWithId) {
  return invoke<TauriStatus>("create_character", { 
    form: serializeObject(character, keys)
  })
}

async function update(id: String, character: CharacterWithId) {
  return invoke<TauriStatus>("update_character", {
    id,
    form: character
  })
}

async function remove(id: string) {
  return invoke<TauriStatus>("delete_character", {
    id
  })
}

async function findAll(): Promise<CharacterWithId[]> {
  const characters = await invoke<CharacterWithId[]>("list_characters", {
    params: { page: 1, charactersPerPage: 100 }
  })
  return characters.map((char) => deserializeObject(char, keys)) as CharacterWithId[]
}

const characterRepository = {
  create, update, remove, findAll
}
export default characterRepository
