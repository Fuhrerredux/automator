import { defineStore } from 'pinia'
import FocusRepository from '@/database/focus'

const useFocusStore = defineStore({
  id: 'focuses',
  state: () => {
    return {
      focuses: [] as FocusTree.FocusWithId[],
  
    }
  },
  actions: {
    async findAll(): Promise<FocusTree.FocusWithId[]> {
      this.focuses = await FocusRepository.findAll()
      return this.focuses
    },
    async findOne(id: string): Promise<FocusTree.Focus> {
      return FocusRepository.findById(id)
    },
    async importAll(focuses: FocusTree.FocusWithId[]) {
      const promises = focuses.map((e) => FocusRepository.create(e))
      return await Promise.all(promises)
    },
    async create(focus: FocusTree.FocusWithId): Promise<Tauri.Broadcast> {
      const status = await FocusRepository.create(focus)
      if (status.kind === 'success') this.focuses = await FocusRepository.findAll()

      return status
    },
    async update(focus: FocusTree.FocusWithId): Promise<Tauri.Broadcast> {
      const status = await FocusRepository.update(focus.id, focus)
      if (status.kind === 'success') this.focuses = await FocusRepository.findAll()

      return status
    },
    async remove(focus: FocusTree.FocusWithId): Promise<Tauri.Broadcast> {
      const status = await FocusRepository.remove(focus.id)
      if (status.kind === 'success') this.focuses = await FocusRepository.findAll()

      return status
    },
    async purge(): Promise<Tauri.Broadcast> {
      const status = await FocusRepository.purge()
      if (status.kind === 'success') this.focuses = await FocusRepository.findAll()

      return status
    },
    async refresh() {
      try {
        this.focuses = await this.findAll()
      } catch (e) {
        console.error('Failed to refresh focuses', e)
      }
    }
  }
})

export default useFocusStore