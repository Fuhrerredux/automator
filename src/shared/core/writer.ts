import { buildToken } from '@shared/core/data'
import { buildCharacterToken } from '@shared/utils/character'
import { groupBy } from '@shared/utils/core'
import { getIdeologySuffix, getIdeologyToken } from '@shared/utils/ideology'
import { getPositionSuffix, isCivilianPosition, isMilitaryPosition } from '@shared/utils/position'
import { BaseDirectory, writeFile } from '@tauri-apps/api/fs'

const PORTRAIT_LARGE_PREFIX = 'Portrait'
const PORTRAIT_EXT = '.png'
function buildLargePortaitPath(name: string, tag: string) {
  return `gfx/leaders/${tag}/${PORTRAIT_LARGE_PREFIX}_${tag}_${buildToken(name)}${PORTRAIT_EXT}`
}
function buildSmallPortraitPath(name: string, tag: string) {
  return `gfx/ministers/${tag}/${tag}_${buildToken(name)}${PORTRAIT_EXT}`
}

function definePortraits(character: CharacterWithId): string {
  const { name, tag, roles } = character
  const hasCivillian = roles.includes('leader') || roles.includes('minister')
  const hasArmy = roles.includes('marshal') || roles.includes('general')
  const hasArmyWithOfficer = hasArmy || roles.includes('officer')
  const hasNavy = roles.includes('admiral')

  let portraits = ''
  if (hasCivillian) {
    const template = `\tcivilian = {
        ${roles.includes('leader') && `large = ${buildLargePortaitPath(name, tag)})`}
        ${roles.includes('minister') && `small = ${buildSmallPortraitPath(name, tag)}`}
      }`
    portraits = portraits.concat(template)
  }
  if (hasArmyWithOfficer) {
    const template = `
      army = {
        ${hasArmy && `large = ${buildLargePortaitPath(name, tag)})`}
        ${roles.includes('officer') && `small = ${buildSmallPortraitPath(name, tag)}`}
      }
    `
    portraits = portraits.concat(template)
  }
  if (hasNavy) {
    const template = `navy = {
        large = ${buildLargePortaitPath(name, tag)}
      }
    `
    portraits = portraits.concat(template)
  }
  return portraits
}

function defineCountryLeader(character: CharacterWithId): string {
  return character.roles.includes('leader')
    ? `country_leader = {
      ideology = ${getIdeologyToken(character.ideology)}_subtype
      traits = {
        ${character.leaderTraits.join('\n')}
      }
    }`
    : ''
}

function defineCommandingRole(character: CharacterWithId): string {
  if (character.roles.includes('marshal')) {
    return `field_marshal = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
      attack_skill = 1
      defense_skill = 1
      planning_skill = 1
      logistics_skill = 1
    }`
  }
  if (character.roles.includes('general')) {
    return `corps_commander = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
      attack_skill = 1
      defense_skill = 1
      planning_skill = 1
      logistics_skill = 1
    }`
  }
  if (character.roles.includes('admiral')) {
    return `navy_leader = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
      attack_skill = 1
      defense_skill = 1
      maneuvering_skill = 1
      coordination_skill = 1
    }`
  }

  return ''
}

function defineMinisterialRole(character: CharacterWithId): string {
  const { positions, ministerTraits, cost } = character
  const token = `${buildCharacterToken(character)}`

  let advisor = ''
  const ministerPositions = positions.filter((e) => isCivilianPosition(e))
  for (const position of ministerPositions) {
    const ideology = getIdeologyToken(character.ideology)
    const trait = ministerTraits[position as MinisterPosition]
    const idea = `${token}_${getPositionSuffix(position)}_${getIdeologySuffix(character.ideology)}`

    const template = `advisor = {
      cost = ${cost}
      slot = ${buildToken(position)}
      available = { 
        hidden_trigger = { has_country_flag = ${idea}_hired }
      }
      idea_token = ${idea}
      can_be_fired = no
      on_add = {
        ROOT = { set_country_flag = ${idea}_hired }
      }
      on_remove = {
        ROOT = { clr_country_flag = ${idea}_hired }
      }
      traits = {
        ${ideology}
        ${trait}
      }
    }`
    advisor = advisor.concat(template)
  }

  return advisor
}

function defineOfficerRole(character: CharacterWithId): string {
  const { positions, officerTraits, cost } = character
  const token = `${buildCharacterToken(character)}`

  let advisor = ''
  const officerPositions = positions.filter((e) => isMilitaryPosition(e))
  for (const position of officerPositions) {
    const trait = officerTraits[position as MilitaryPosition]
    const idea = `${token}_${getPositionSuffix(position)}_${getIdeologySuffix(character.ideology)}`

    const template = `advisor = {
      cost = ${cost}
      slot = ${buildToken(position)}
      idea_token = ${idea}
      traits = {
        ${trait}
      }
    }`
    advisor = advisor.concat(template)
  }

  return advisor
}

export function writeCharacter(characters: CharacterWithId[]) {
  let content: string = ''
  for (const character of characters) {
    const portraits = definePortraits(character)

    const data = `\t${buildCharacterToken(character)} = {
    name = "${character.name}"
    portraits = {
    ${portraits}}
    ${defineCountryLeader(character)}
    ${defineCommandingRole(character)}
    ${defineMinisterialRole(character)}
    ${defineOfficerRole(character)}
  }`
    content = content.concat(data)
  }

  return content
}

export default async function exportCharacters(characters: CharacterWithId[]) {
  if (Array.isArray(characters)) {
    const grouped = groupBy(characters, 'tag')
    for (const [key, value] of Object.entries(grouped)) {
      const content = writeCharacter(value)
      const template = ` # Characters for ${key}
characters = {
${content}
}`
      await writeFile(`${key}.txt`, template, { dir: BaseDirectory.Document })
    }
  }
}
