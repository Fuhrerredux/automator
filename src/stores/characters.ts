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
    async update(character: CharacterWithId) {
      const status = await CharacterRepository.update(character.id, character)
      if (status.kind === 'success')
        this.characters = await CharacterRepository.findAll()
    },
    async remove(character: CharacterWithId) {
      await CharacterRepository.remove(character.id)
      this.characters = await CharacterRepository.findAll()
    },
    async purge() {
      // await CharacterRepository.purge()
      this.characters = await CharacterRepository.findAll()
    },
    async refresh() {
      try {
        this.characters = await CharacterRepository.findAll()
      } catch {}
    }
  }
})
export default useCharacterStore
