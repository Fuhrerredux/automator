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
  actions: {
    async import() {
      const json = await readTextFile('.automator/data/config.json', { dir: BaseDirectory.Home })
      this.$state = { ...this.$state, ...JSON.parse(json) }
    }
  }
})
export default useConfiguration
