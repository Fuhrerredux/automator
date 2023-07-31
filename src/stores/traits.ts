import { defineStore } from 'pinia'
import { extractTraits } from '@shared/core/reader'
import { readDir, readTextFile } from '@tauri-apps/api/fs'

const useTraitsStore = defineStore({
  id: 'traits',
  state: () => {
    return {
      traits: {
        'head-of-government': [],
        'foreign-minister': [],
        'economy-minister': [],
        'security-minister': [],
        'high-command': [],
        'army-chief': [],
        'navy-chief': [],
        'air-chief': []
      },
      files: [],
      trait: null
    } as TraitsStore
  },
  actions: {
    async fetchFromLocalStorage() {
      this.trait = localStorage.getItem('trait')
      await this.readTraits()
    },
    async readDir(path: string) {
      const target = `${path}/country_leader`
      try {
        this.files = await readDir(target)
      } catch {}
    },
    async readTraits() {
      if (!this.trait) return Promise.resolve()

      const content = await readTextFile(this.trait)
      this.traits = extractTraits(content)
    }
  }
})
export default useTraitsStore
