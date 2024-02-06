import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { defineStore } from "pinia";

const useCustomConfig = defineStore({
  id: 'customConfig',
  state: () => {
    return {
      config: {
        ideologies: {}
      }
    }
  },
  actions: {
    async import() {
      const json = await readTextFile('.automator/data/config.json', { dir: BaseDirectory.Home })
      console.log(json)
      this.config = JSON.parse(json)
    }
  }
})
export default useCustomConfig