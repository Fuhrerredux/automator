import { validateConfiguration } from '@shared/utils/configuration'
import { getIdeologyKeyFromShort, isIdeologyToken } from '@shared/utils/ideology'
import { getPositionSuffix, isAdvisorPosition, parsePosition } from '@shared/utils/position'
import { extractValue } from '@shared/utils/reader'
import { readDir, readTextFile } from '@tauri-apps/api/fs'

export let countryTags: string[] = []

export async function readConfigurationFile(filePath: string): Promise<Automator.Configuration> {
  try {
    const raw = await readTextFile(filePath)
    const json = JSON.parse(raw)
    if (validateConfiguration(json)) {
      return json as Automator.Configuration
    } else throw Error('Invalid Configuration')
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function readSpriteUsage(sprite: SpriteType, base: string) {
  const dir = `${base}/${sprite.directory}`

  const entries = await readDir(dir)
  const sprites: string[] = []
  for (const entry of entries) {
    const data = await readTextFile(entry.path)
    const lines = data.split('\n')
    for (const line of lines) {
      if (line.trim().includes(sprite.property)) {
        let content = line.replace(/ /g, '')
        sprites.push(content.substring(content.lastIndexOf('=') + 1).trim())
      }
    }
  }

  return Array.from(new Set(sprites))
}

export function readSpriteDefinitions(content: string): Sprite[] {
  const sprites: Sprite[] = []
  const lines = content.split('\n')
  lines.forEach((str, index) => {
    if (str.includes('spriteType')) {
      if (lines.length > index + 2) {
        let name = lines[index + 1]
        let dir = lines[index + 2]

        name = name.substring(name.indexOf('"') + 1, name.lastIndexOf('"')).trim()
        dir = dir.substring(dir.indexOf('"') + 1, dir.lastIndexOf('"')).trim()

        if (name.trim().length > 0 && dir.trim().length > 0) sprites.push({ name, path: dir })
      }
    }
  })
  return sprites
}

const positions: Position[] = [
  'head_of_government',
  'foreign_minister',
  'economy_minister',
  'security_minister',
  'high_command',
  'army_chief',
  'navy_chief',
  'air_chief',
  'theorist'
]

export function extractTraits(
  content: string,
  config: Automator.Configuration
): Record<Position, string[]> {
  const traits: Record<Position, string[]> = {
    head_of_government: [],
    foreign_minister: [],
    economy_minister: [],
    security_minister: [],
    high_command: [],
    army_chief: [],
    navy_chief: [],
    air_chief: [],
    theorist: []
  }

  const extract = (prefix: string, s: string) => {
    const safePrefix = `${prefix}_`
    const trait = s.substring(s.indexOf(safePrefix), s.indexOf('='))
    return trait.trim()
  }

  content.split('\n').forEach((e) => {
    for (const key of Object.keys(traits)) {
      const prefix = getPositionSuffix(key as unknown as Automator.Position, config)
      const data = e.trim()
      if (data.startsWith(prefix)) {
        const arr = traits[key as Position]
        arr.push(extract(prefix, e))
        traits[key as Position] = arr
      }
    }
  })

  return traits
}

export function readCharacterFile(
  content: string,
  config: Automator.Configuration
): Record<string, any>[] {
  if (content.length <= 0) return []

  let lines = content.split('\n')
  lines = lines.slice(1, lines.length - 1)
  if (lines.length >= 3) {
    const tag = lines[0].trim().substring(0, 3)

    const characters: string[] = []
    let character = lines[0].trimStart()

    lines = lines.slice(1)
    lines.forEach((line, index, arr) => {
      if (line.trim().startsWith(tag)) {
        if (character.length > 0) characters.push(character)
        character = line.trimStart()
      } else {
        character = character.concat(`\n${line}`)
      }

      // when nearing the end of the lines
      // add to array
      if (index === arr.length - 1 && character.length > 0) characters.push(character)
    })

    const parsedChars: Record<string, any>[] = []
    for (const character of characters) {
      const parsed: Record<string, any> = {}
      parsed.tag = tag
      parsed.cost = 150
      parsed.positions = []
      parsed.roles = []
      parsed.leaderTraits = []
      parsed.leaderIdeologies = []
      parsed.commanderTraits = []
      parsed.advisorRoles = {
        head_of_government: '',
        foreign_minister: '',
        economy_minister: '',
        security_minister: ''
      }
      parsed.officerTraits = {
        high_command: '',
        army_chief: '',
        air_chief: '',
        navy_chief: '',
        theorist: ''
      }

      const advisor = extractAdvisorRoles(character)
      advisor.forEach((content) => {
        // get advisor traits
        content.split('\n').forEach((e) => {
          const trimmed = e.trim()
          positions.forEach((position) => {
            const prefix = getPositionSuffix(position as unknown as Automator.Position, config)
            if (trimmed.startsWith(`${prefix}_`) && isAdvisorPosition(position, config)) {
              parsed.advisorRoles[`${position}`] = trimmed
            }
          })
        })
      })

      const contents = character.split('\n')
      contents.forEach((content, index) => {
        if (content.includes('name')) {
          const name = extractValue(content, true)
          parsed.name = name
        }

        if (content.includes('country_leader')) {
          parsed.roles = [...parsed.roles, 'leader']
        }

        if (content.includes('field_marshal')) {
          parsed.roles = [...parsed.roles, 'marshal']
        } else if (content.includes('corps_commander')) {
          parsed.roles = [...parsed.roles, 'general']
        } else if (content.includes('navy_leader')) {
          parsed.roles = [...parsed.roles, 'admiral']
        }

        if (content.includes('ideology')) {
          const ideology = extractValue(content)
          if (ideology.includes('subtype')) {
            const target = ideology.indexOf('subtype') - 1
            parsed.ideology = ideology.substring(0, target)
          }
        }
        if (!contents.includes('ideology') && content.includes('traits')) {
          const target = contents[index + 1]
          if (isIdeologyToken(target, config)) {
            parsed.ideology = target.trim()
          }
        }
        if (content.includes('slot')) {
          const position = extractValue(content).trim()
          parsed.positions = [...parsed.positions, position]

          if (isAdvisorPosition(position, config) && !parsed.roles.includes('advisor')) {
            parsed.roles = [...parsed.roles, 'advisor']
          }
        }
      })

      parsedChars.push(parsed)
    }

    return parsedChars
  }

  return []
}

function extractAdvisorRoles(content: string): string[] {
  if (content.length <= 0) return []

  const start = content.indexOf('advisor')
  if (start < 0) return []

  let lines = content.substring(start).split('\n')
  const roles: string[] = []

  let role = lines[0]
  lines = lines.slice(1)
  lines.forEach((line, index, arr) => {
    if (line.trim().startsWith('advisor')) {
      if (role.length > 0) roles.push(role)
      role = line.trimStart()
    } else {
      role = role.concat(`\n${line}`)
    }

    // when nearing the end of the lines
    // add to array
    if (index === arr.length - 1 && role.length > 0) roles.push(role)
  })

  return roles
}

export function readLocalisationFile(content: string, config: Automator.Configuration) {
  if (content.length <= 0) return []

  function extractPosition(token: string) {
    const positions = ['hog', 'for', 'eco', 'sec', 'cos', 'carm', 'cnav', 'cair', 'theo']
    return positions.find((e) => token.includes(`_${e}`))
  }
  function extractIdeology(token: string) {
    const ideologies = ['van', 'col', 'lib', 'sde', 'sli', 'mli', 'sco', 'ade', 'pau', 'npo', 'val']
    return ideologies.find((e) => token.includes(`_${e}`))
  }

  const records: Character[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length <= 0) continue

    const token = trimmed.substring(0, trimmed.indexOf(':'))
    const tag = token.substring(0, 3)
    const position = parsePosition(extractPosition(token), config)
    const ideology = extractIdeology(token)

    const parts = trimmed.split('"')
    if (parts.length < 3) continue // If there are not enough quotes, skip this line
    const name = parts[1]

    const record: Character = {
      name,
      tag,
      ideology: getIdeologyKeyFromShort(ideology, config) ?? 'vanguardist',
      roles: [],
      leaderRoles: [],
      commanderTraits: [],
      advisorRoles: []
    }

    const index = records.findIndex((e) => e.name === name)
    if (index >= 0) {
      const curr = records[index]
      if (
        position &&
        isAdvisorPosition(String(position), config) &&
        !curr.roles.includes('advisor')
      ) {
        curr.roles = [...curr.roles, 'advisor']
      }
      records[index] = curr
    } else {
      if (
        position &&
        isAdvisorPosition(String(position), config) &&
        !record.roles.includes('advisor')
      ) {
        record.roles = [...record.roles, 'advisor']
      }
      records.push(record)
    }
  }

  return records
}

export async function loadCountryTags(filePath: string): Promise<void> {
  const content = await readTextFile(filePath)
  const lines = content.split('\n')

  for (const line of lines) {
    const tag = line.split('=')[0].trim()
    if (tag && !tag.startsWith('#')) {
      countryTags.push(tag)
    }
  }

  // Sort country tags alphabetically
  countryTags.sort()
}
