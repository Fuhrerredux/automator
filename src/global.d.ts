import type { Component } from 'vue'
import type { ExportedGlobalComposer, VueI18n } from 'vue-i18n'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string
    }
  }

  namespace Tauri {
    interface Broadcast {
      kind: string
      message: string
    }
  }
  namespace UserInterface {
    type Theme = 'light' | 'dark' | 'auto'
    type TabData = {
      panel: Component
      label: string
    }
    type DataOption = { value: string; label: string }
  }
  namespace Automator {
    type Definition = { key: string; name: string; short: string }
    type Ideology = Definition
    type Position = Definition & { hirable?: boolean; removable?: boolean }
    type Configuration = {
      ideologies: Record<string, Omit<Ideology, 'key'>>
      positions: Record<string, Omit<Position, 'key'>>
      character: {
        defaultCost: number
      }
    }

    type Preference = {
      customConfig: boolean
      positionPrevention: boolean
      optionLogging: boolean
      language: string
      predefinedConfiguration: string | null
    }
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

  type CommandingRole = 'marshal' | 'general' | 'admiral' | 'officer'
  type CharacterRole = CommandingRole | 'leader' | 'advisor'
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
    ideology: string | null
    leaderRoles: CountryLeader[]
    advisorRoles: Advisor[]
    commanderTraits: string[]
    roles: CharacterRole[]
  }
  type CharacterWithId = Character & { id: string }
  type CharacterForm = {
    ideology: Automator.Ideology | string | null
    commanderRole: CommandingRole | null
    commanderTraits: string[]
    advisorRoles: Advisor[]

    addLeaderRole: boolean
    addCommanderRole: boolean
    addAdvisorRole: boolean
  } & Pick<Character, 'name' | 'tag' | 'leaderRoles'>
  type CountryLeader = {
    subideology: string
    trait: string
  }
  type CountryLeaderForm = Omit<CountryLeader, 'subideology'> & { subideology: string }
  type Commander = {
    type: CommandingRole
    traits: string
  }
  type Advisor = {
    slot: string
    hirable: boolean
    removeable: boolean
    trait: string
    cost: number
  }
  type Sprite = {
    name: string
    path: string
    file?: string
    exists?: boolean
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

  type SpriteEntry = {
    name: string
    texturefile: string
  }

  type SpriteEntryWithTag = SpriteEntry & {
    tag?: string
    tagIndex?: number
  }

  type TauriStatus = {
    kind: string
    message: string
  }
}

declare module 'vue' {
  // hack to take care of typing errors caused by the
  // vue-i18n library.
  interface ComponentCustomProperties {
    $i18n: VueI18n | ExportedGlobalComposer
  }
}
