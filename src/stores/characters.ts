import { defineStore } from 'pinia'
import CharacterRepository from '@database/character'

const useCharacterStore = defineStore({
  id: 'characters',
  state: () => {
    return {
      characters: [] as CharacterWithId[]
    }
  },
  actions: {
    async importAll(characters: CharacterWithId[]) {
      const promises = characters.map((e) => CharacterRepository.create(e))
      return await Promise.all(promises)
    },
    async create(character: CharacterWithId): Promise<TauriStatus> {
      const status = await CharacterRepository.create(character)
      if (status.kind === 'success')
        this.characters = await CharacterRepository.findAll()

      return status
    },
    async update(character: CharacterWithId): Promise<TauriStatus> {
      const status = await CharacterRepository.update(character.id, character)
      if (status.kind === 'success')
        this.characters = await CharacterRepository.findAll()

      return status
    },
    async remove(character: CharacterWithId): Promise<TauriStatus> {
      const status = await CharacterRepository.remove(character.id)
      if (status.kind === 'success')
        this.characters = await CharacterRepository.findAll()

      return status
    },
    async purge(): Promise<TauriStatus> {
      const status = await CharacterRepository.purge()
      if (status.kind === 'success')
        this.characters = await CharacterRepository.findAll()
      
      return status
    },
    async refresh() {
      try {
        this.characters = await CharacterRepository.findAll()
      } catch {}
    }
  }
})
export default useCharacterStore
