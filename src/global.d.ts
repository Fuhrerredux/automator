import type { Component } from 'vue'
import type { ExportedGlobalComposer, VueI18n } from 'vue-i18n'
import type { FileEntry } from '@tauri-apps/api/fs'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
    }
  }

  type Theme = 'light' | 'dark' | 'auto'
  type ThemeResource = {
    theme: Theme
    change: (current: Theme) => void
  }

  type KeyOfType<T, V> = keyof {
    // [!code ++]
    [P in keyof T as T[P] extends V ? P : never]: any // [!code ++]
  }
  type ComponentProps<V, I> = {
    options: I[]
    valueKey: KeyOfType<I, V> | ((item: I) => V)
    displayKey: keyof I | ((item: I) => string)
  }
  type DropdownOption<T> = { label: string; value: T }

  type ModStore = {
    directory: string
    entries: FileEntry[]
  }
  type TraitsStore = {
    traits: Record<Position, string[]>
    files: FileEntry[]
    trait: string | null
  }

  type Ideology =
    | 'vanguardist'
    | 'collectivist'
    | 'libertarian_socialist'
    | 'social_democrat'
    | 'social_liberal'
    | 'market_liberal'
    | 'social_conservative'
    | 'authoritarian_democrat'
    | 'paternal_autocrat'
    | 'national_populist'
    | 'valkist'
  type CommandingRole = 'marshal' | 'general' | 'admiral' | 'officer'
  type CharacterRole = CommandingRole | 'leader' | 'minister'
  type MinisterPosition =
    | 'head_of_government'
    | 'foreign_minister'
    | 'economy_minister'
    | 'security_minister'
  type MilitaryPosition = 'high_command' | 'army_chief' | 'air_chief' | 'navy_chief' | 'theorist'
  type Position = MinisterPosition | MilitaryPosition
  type Character = {
    name: string
    tag: string
    ideology: Ideology
    positions: Position[]
    leaderTraits: string[]
    leaderIdeologies: string[]
    commanderTraits: string[]
    ministerTraits: Record<MinisterPosition, string>
    officerTraits: Record<MilitaryPosition, string>
    roles: CharacterRole[]
    cost: number
  }
  type CharacterWithId = Character & { id: string }
  type Sprite = {
    name: string
    path: string
    file?: string
    exists?: boolean
  }

  type TabData = {
    panel: Component
    label: string
  }

  type AnalyzeData = {
    sprite: string
    path: string | null
    status: 'undef' | 'missing' | 'good'
  }
  type SpriteType = {
    type: 'idea' | 'focus'
    property: string
    directory: string
    res: string
  }
}

declare module 'vue' {
  // hack to take care of typing errors caused by the
  // vue-i18n library.
  interface ComponentCustomProperties {
    $i18n: VueI18n | ExportedGlobalComposer
  }
}
