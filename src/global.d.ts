import type { Component } from 'vue'
import type { FileEntry } from '@tauri-apps/api/fs'
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
    type Definition = { key: string; name: string; short?: string }
    type Ideology = Definition
    type Position = Definition & {
      hirable?: boolean
      removable?: boolean
    }
    type Configuration = {
      ideologies: Record<string, Omit<Ideology, 'key'>>
      positions: Record<string, Omit<Position, 'key'>>
      character: {
        defaultCost: number
        largePortraitPath: string
        smallPortraitPath: string
      },
      localisation: {
        countryDir: string
      }
    }
    type Preference = {
      customConfig: boolean
      positionPrevention: boolean
      optionLogging: boolean
      language: string
      predefinedConfiguration: string | null
      usesIdeologySuffixOnToken: boolean
      useInputForAdvisorTraitBox: boolean
      // traitSource: boolean
    }
    type ModStore = {
      directory: string
      entries: FileEntry[]
    }
    type TraitsStore = {
      traits: Record<Position, string[]>
      files: FileEntry[]
      trait: string | null
    }
    type ConfigurationStore = {
      config: Automator.Configuration
    }
    
    namespace CharacterDefinitions  {
      type CharacterPositions = {
        config: Automator.Configuration
        positions: Automator.Position[]
      }
    } //for future trait rework
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
    advisorRoles: Advisor[] // ?
    commanderRoles?: Characters.General[]
    roles: CharacterRole[]
  }
  type CharacterWithId = Character & { id: string }
  type CharacterWithScope = Character & { scope: string }
  type CharacterForm = {
    ideology: Automator.Ideology | string | null
    commanderRoles?: Characters.General[]
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
    trait: string
  }
  type GeneralForm = Omit<Characters.General, 'type'> & { type: DropdownOption<Characters.General> }
  type Advisor = {
    slot: string
    hirable: boolean
    removeable: boolean
    trait: string
    cost: number
  }
  namespace Characters {
    type Portrait = {
      small?: string
      large?: string
    }
    type Officer = Advisor
    type ArmyPortrait = Portrait
    type CivilianPortrait = Portrait
    type NavyPortrait = Portrait
    type GeneralRole = Exclude<CommandingRole, 'officer'>
    type General = {
      type: GeneralRole
      trait: string
    }
    type CharacterRoles = {
      leaderRoles?: CountryLeader[]
      commandingRoles?: General[]
      advisorRoles?: Advisor[]
    }
    type NameLoc = { scope: string; name: string }
    type AdvisorWithToken = Advisor & { ideaToken: string }
    type AdvisorWithPositionPrevention = AdvisorWithToken & { positionPrevention: string }
    type Commanding = {
      [key in Characters.GeneralRole]?: Characters.General
    }
    type GeneralPartial = Partial<Record<Characters.GeneralRole, Characters.General>>
    type ExtractedData = {
      [key: string]: CharacterWithScope
    }
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

  type Focus = {
    tag?: string
    id: string
  }

  type FocusTree = {
    tag: string
    focuses: Focus[]
  }

  type FocusLocEntry = {
    id: string
    desc: string
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
