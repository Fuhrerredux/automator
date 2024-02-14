import { defineStore } from 'pinia'
import defaultIdeologies from '@/shared/const/ideology'
import defaultPositions from '@/shared/const/positions'
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs'

type ConfigurationStore = {
  config: Automator.Configuration
}

const useConfiguration = defineStore({
  id: 'customConfig',
  state: (): ConfigurationStore => {
    return {
      config: {
        ideologies: defaultIdeologies,
        positions: defaultPositions,
        character: {
          defaultCost: 150
        }
      }
    }
  },
  getters: {
    ideologiesArray: ({ config: { ideologies } }) =>
      Object.entries(ideologies).map(([key, value]) => ({
        key,
        name: value.name,
        short: value.short
      })),
    positionsArray: ({ config: { positions } }) =>
      Object.entries(positions).map(([key, value]) => ({
        key,
        name: value.name,
        short: value.name
      }))
  },
  actions: {
    async import() {
      const json = await readTextFile('.automator/data/config.json', { dir: BaseDirectory.Home })
      this.$state = { ...this.$state, ...JSON.parse(json) }
    }
  }
})
export default useConfiguration
