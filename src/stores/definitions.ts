import { defineStore } from 'pinia'
import { readSpriteDefinitions } from '@shared/core/reader'
import { groupBy } from '@shared/utils/core'
import { readFileObject, removeBaseDirectoryFromPath } from '@shared/utils/reader'
import { type FileEntry, exists, readDir } from '@tauri-apps/api/fs'

const useSpriteDefinitions = defineStore({
  id: 'duplicates',
  state: () => {
    const definitions: Map<string, Sprite[]> = new Map()
    const duplicates: Map<string, Sprite[]> = new Map()

    return {
      orphaned: [] as FileEntry[],
      files: [] as File[],
      unique: [] as Sprite[],
      definitions,
      duplicates
    }
  },
  actions: {
    async importToFiles(files: File[]) {
      this.files = files
      for (const file of files) {
        const data = await readFileObject(file)
        const sprites = readSpriteDefinitions(data)
        this.definitions.set(file.name, sprites)
      }
    },
    async checkExistence(baseDir: string) {
      const definitions: Map<string, Sprite[]> = new Map()
      for (const [key, value] of this.definitions) {
        const sprites: Sprite[] = []
        for (const entry of value) {
          let fileExists = await exists(`${baseDir}/${entry.path}`)
          const sprite: Sprite = { ...entry, exists: fileExists }
          sprites.push(sprite)
        }
        definitions.set(key, sprites)
      }
      this.definitions = definitions
    },
    findDuplicates() {
      const definitions: Map<string, Sprite[]> = new Map()
      this.definitions.forEach((value, key) => {
        const updated = value.map((e) => ({ ...e, file: key }))
        definitions.set(key, updated)
      })

      let merged: Sprite[] = []
      for (const arr of definitions.values()) {
        merged = [...merged, ...arr]
      }

      const unique = new Set<Sprite>()
      const duplicate: Sprite[] = []

      for (const item of merged) {
        const parsed: Sprite = JSON.parse(JSON.stringify(item))

        if (Array.from(unique).find((e) => e.name === parsed.name)) {
          duplicate.push(item)
        } else {
          unique.add(item)
        }
      }

      const raw = groupBy(duplicate, 'name')
      const duplicates: Map<string, Sprite[]> = new Map()
      for (const [key, value] of Object.entries(raw)) {
        duplicates.set(key, value)
      }
      this.unique = Array.from(unique)
      this.duplicates = duplicates
    },
    async findOrphaned(baseDir: string) {
      const target = `${baseDir}/gfx/interface/goals`
      const entries = await readDir(target)
      const orphaned: FileEntry[] = []

      for (const entry of entries) {
        const path = removeBaseDirectoryFromPath(baseDir, entry.path)

        if (!this.unique.find((e) => e.path === path)) orphaned.push(entry)
      }
      this.orphaned = orphaned
    }
  }
})
export default useSpriteDefinitions
