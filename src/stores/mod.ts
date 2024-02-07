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
    getCommonDirectory(store: ModStore) {
      return store.entries.find((e) => e.name === 'common')
    },
    getLocalisationDirectory(store: ModStore) {
      return store.entries.find((e) => e.name === 'localisation')
    }
  },
  actions: {
    async readEntries(path: string) {
      this.entries = await readDir(path)
    }
  }
})
export default useModStore
