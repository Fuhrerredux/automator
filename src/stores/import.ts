import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'

const useImportStore = defineStore({
  id: 'imports',
  state: () => {
    return {
      characters: [] as CharacterWithId[]
    }
  },
  getters: {
    count(): number {
      return this.characters.length
    }
  },
  actions: {
    async upsert(character: CharacterWithId) {
      const index = this.characters.findIndex((e) => e.id === character.id)
      const toUpdate = Array.from(this.characters)

      if (index >= 0) {
        toUpdate[index] = character
      } else {
        toUpdate.push(character)
      }
      this.characters = toUpdate
    },
    async remove(character: CharacterWithId) {
      this.characters = this.characters.filter((e) => e.id !== character.id)
    },
    importData(imports: Record<string, any>[]) {
      this.characters = imports.map((e) => ({ ...e, id: nanoid() }) as CharacterWithId)
    }
  }
})
export default useImportStore
