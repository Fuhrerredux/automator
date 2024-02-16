import { defineStore } from 'pinia'
import defaultIdeologies from '@shared/const/ideology'
import defaultPositions from '@shared/const/positions'
import kaiserreichConfiguration from '@shared/definitions/kaiserreich'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

type ConfigurationStore = {
  config: Automator.Configuration
}

const CONFIG_SOURCE = '.automator/data/config.json'
const configuration: { key: string; definition: Automator.Configuration }[] = [
  { key: 'kr', definition: kaiserreichConfiguration }
]

const defaultConfiguration: Automator.Configuration = {
  ideologies: defaultIdeologies,
  positions: defaultPositions,
  character: {
    defaultCost: 150
  }
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
      const json = await readTextFile(CONFIG_SOURCE, { dir: BaseDirectory.Home })
      this.$state = { ...this.$state, ...JSON.parse(json) }
    },
    async change(key: string) {
      const newConfig = configuration.find((e) => e.key === key)
      if (newConfig) {
        this.$state.config = newConfig.definition
        await writeTextFile(CONFIG_SOURCE, JSON.stringify(newConfig.definition), {
          dir: BaseDirectory.Home
        })
      }
    },
    revert() {
      this.$state.config = defaultConfiguration
    }
  }
})
export default useConfiguration
