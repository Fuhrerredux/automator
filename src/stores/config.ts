import { defineStore } from 'pinia'
import defaultIdeologies from '@shared/const/ideology'
import defaultPositions from '@shared/const/positions'
import kaiserreichConfiguration from '@shared/definitions/kaiserreich'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

const CONFIG_SOURCE = '.automator/data/config.json'
const configuration: { key: string; definition: Automator.Configuration }[] = [
  { key: 'kr', definition: kaiserreichConfiguration }
]

const defaultConfiguration: Automator.Configuration = {
  ideologies: defaultIdeologies,
  positions: defaultPositions,
  character: {
    defaultCost: 150,
    largePortraitPath: 'gfx/leaders',
    smallPortraitPath: 'gfx/interface/ministers'
  },
  localisation: {
    countryDir: 'FX_country_specific'
  }
}

const useConfiguration = defineStore({
  id: 'customConfig',
  state: (): Automator.ConfigurationStore => {
    return {
      config: {
        ideologies: defaultIdeologies,
        positions: defaultPositions,
        character: {
          defaultCost: 150,
          largePortraitPath: 'gfx/leaders',
          smallPortraitPath: 'gfx/interface/ministers'
        },
        localisation: {
          countryDir: 'FX_country_specific'
        }
      }
    }
  },
  getters: {
    ideologiesArray: ({ config: { ideologies } }) => {
      return Object.entries(ideologies).map(([key, value]) => ({
        key,
        name: value.name,
        short: value.short || ''
      }))
    },
    positionsArray: ({ config: { positions } }): Automator.Position[] => {
      return Object.entries(positions).map(([key, value]) => ({
        key,
        name: value.name,
        short: value.name,
        hirable: value.hirable,
        removable: value.removable
      }))
    }
  },
  actions: {
    /**
     * Function to load the configuration data from the
     * default source file. Can also be used to load
     * configuration data from other file if a file path
     * string is provided.
     *
     * @param source file path, if skipped, the default path will be used.
     */
    async import(source: string = CONFIG_SOURCE) {
      const json = await readTextFile(source, { dir: BaseDirectory.Home })
      this.$state.config = { ...this.$state.config, ...JSON.parse(json) }
    },
    /**
     * Function to change the current values of the configuration
     * data from another config object.
     *
     * @param config configuration data object
     */
    async replace(config: Automator.Configuration) {
      this.$state = { config }
      await writeTextFile(CONFIG_SOURCE, JSON.stringify(config, null, 4), {
        dir: BaseDirectory.Home
      })
    },
    /**
     * Function used to change the current configuration
     * data to a predefined one.
     *
     * @param key the key from a predefined config data.
     */
    async change(key: string) {
      const newConfig = configuration.find((e) => e.key === key)
      if (newConfig) {
        this.$state.config = newConfig.definition
        await writeTextFile(CONFIG_SOURCE, JSON.stringify(newConfig.definition, null, 4), {
          dir: BaseDirectory.Home
        })
      }
    },
    /**
     * Function used to revert the configuration data to
     * it's defaults and remove all custom data defined
     * in the source file.
     */
    async revert() {
      this.$state.config = defaultConfiguration
      await writeTextFile(CONFIG_SOURCE, JSON.stringify(defaultConfiguration, null, 4), {
        dir: BaseDirectory.Home
      })
    }
  }
})
export default useConfiguration
