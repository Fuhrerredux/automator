import { defineStore } from 'pinia'
import { extractTraits } from '@shared/core/reader'
import { readDir, readTextFile } from '@tauri-apps/api/fs'
import type { FileEntry } from '@tauri-apps/api/fs'

type TraitsStore = {
  traits: Record<Position, string[]>
  files: FileEntry[]
  trait: string | null
}

const useTraitsStore = defineStore({
  id: 'traits',
  state: () => {
    return {
      traits: {
        head_of_government: [],
        foreign_minister: [],
        economy_minister: [],
        security_minister: [],
        high_command: [],
        army_chief: [],
        navy_chief: [],
        air_chief: [],
        theorist: []
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
