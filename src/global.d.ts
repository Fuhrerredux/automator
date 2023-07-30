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

  type DropdownOption<T> = { label: string; value: T }

  type Ideology =
    | 'vanguardist'
    | 'collectivist'
    | 'libertarian-socialist'
    | 'social-democrat'
    | 'social-liberal'
    | 'market-liberal'
    | 'social-conservative'
    | 'authoritarian-democrat'
    | 'paternal-autocrat'
    | 'national-populist'
    | 'valkist'
  type CommandingRole = 'marshal' | 'general' | 'admiral'
  type CharacterRole = CommandingRole | 'leader' | 'minister'
  type MinisterPosition =
    | 'head-of-government'
    | 'foreign-minister'
    | 'economy-minister'
    | 'security-minister'
  type MilitaryPosition = 'high-command' | 'army-chief' | 'air-chief' | 'navy-chief'
  type Position = MinisterPosition | MilitaryPosition
  type Character = {
    name: string
    tag: string
    ideology: Ideology
    positions: Position[]
    leaderTraits: string[]
    commanderTraits: string[]
    ministerTraits: Record<MinisterPosition, string>
    roles: CharacterRole[]
    cost: number
  }
  type CharacterWithId = Character & { id: string }
}

export {}
