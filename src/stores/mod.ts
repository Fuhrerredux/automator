import { defineStore } from 'pinia'
import { readDir } from '@tauri-apps/api/fs'

const useModStore = defineStore({
  id: 'mod',
  state: () => {
    return {
      directory: '',
      entries: []
    } as ModStore
  },
  getters: {
    getCommonDirectory(state: ModStore) {
      return state.entries.find((e) => e.name === 'common')
    }
  },
  actions: {
    async readEntries(path: string) {
      this.entries = await readDir(path)
    }
  }
})
export default useModStore
