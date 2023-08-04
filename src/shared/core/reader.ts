import { isIdeologyToken } from '@shared/utils/ideology'
import { getPositionSuffix, isCivilianPosition, isMilitaryPosition } from '@shared/utils/position'
import { extractValue } from '@shared/utils/reader'

const positions: Position[] = [
  'head_of_government',
  'foreign_minister',
  'economy_minister',
  'security_minister',
  'high_command',
  'army_chief',
  'navy_chief',
  'air_chief'
]

export function extractTraits(content: string): Record<Position, string[]> {
  const traits: Record<Position, string[]> = {
    head_of_government: [],
    foreign_minister: [],
    economy_minister: [],
    security_minister: [],
    high_command: [],
    army_chief: [],
    navy_chief: [],
    air_chief: []
  }

  const extract = (prefix: string, s: string) => {
    const safePrefix = `${prefix}_`
    const trait = s.substring(s.indexOf(safePrefix), s.indexOf('='))
    return trait.trim()
  }

  content.split('\n').forEach((e) => {
    for (const key of Object.keys(traits)) {
      const prefix = getPositionSuffix(key as Position)
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

export function readCharacterFile(content: string): Record<string, any>[] {
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
      parsed.ministerTraits = {
        head_of_government: '',
        foreign_minister: '',
        economy_minister: '',
        security_minister: ''
      }
      parsed.officerTraits = {
        high_command: '',
        army_chief: '',
        air_chief: '',
        navy_chief: ''
      }

      const advisor = extractAdvisorRoles(character)
      advisor.forEach((content) => {
        // get advisor traits
        content.split('\n').forEach((e) => {
          const trimmed = e.trim()
          positions.forEach((position) => {
            const prefix = getPositionSuffix(position)
            if (trimmed.startsWith(`${prefix}_`)) {
              if (isCivilianPosition(position)) {
                parsed.ministerTraits[`${position}`] = trimmed
              } else if (isMilitaryPosition(position)) {
                parsed.officerTraits[`${position}`] = trimmed
              }
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
          if (isIdeologyToken(target)) {
            parsed.ideology = target.trim()
          }
        }
        if (content.includes('slot')) {
          const position = extractValue(content).trim()
          parsed.positions = [...parsed.positions, position]

          if (isCivilianPosition(position as Position) && !parsed.roles.includes('minister')) {
            parsed.roles = [...parsed.roles, 'minister']
          }
          if (isMilitaryPosition(position as Position) && !parsed.roles.includes('officer')) {
            parsed.roles = [...parsed.roles, 'officer']
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
