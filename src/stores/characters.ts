import { defineStore } from 'pinia'
import CharacterRepository from '@database/repository'

const repository = CharacterRepository.getInstance()
const useCharacterStore = defineStore({
  id: 'characters',
  state: () => {
    return {
      characters: [] as CharacterWithId[]
    }
  },
  actions: {
    async importAll(characters: CharacterWithId[]) {
      const promises = characters.map((e) => repository.create(e))
      return await Promise.all(promises)
    },
    async create(character: CharacterWithId) {
      await repository.create(character)
      this.characters = await repository.findAll()
    },
    async update(character: CharacterWithId) {
      await repository.update(character)
      this.characters = await repository.findAll()
    },
    async remove(character: CharacterWithId) {
      await repository.remove(character)
      this.characters = await repository.findAll()
    },
    async purge() {
      await repository.purge()
      this.characters = await repository.findAll()
    },
    async refresh() {
      try {
        this.characters = await repository.findAll()
      } catch {}
    }
  }
})
export default useCharacterStore
