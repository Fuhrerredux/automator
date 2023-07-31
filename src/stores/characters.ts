import { defineStore } from 'pinia'
import CharacterRepository from '@/database/repository'

const repository = CharacterRepository.getInstance()
const useCharacterStore = defineStore({
  id: 'characters',
  state: () => {
    return {
      characters: [] as CharacterWithId[]
    }
  },
  actions: {
    async refresh() {
      try {
        this.characters = await repository.findAll()
      } catch {}
    }
  }
})
export default useCharacterStore
