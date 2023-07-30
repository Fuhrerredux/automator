import { buildToken } from '@shared/core/data'
import { buildCharacterToken } from '@shared/utils/character'
import { getIdeologySuffix, getIdeologyToken } from '@shared/utils/ideology'
import { getPositionSuffix } from '@shared/utils/position'

const PORTRAIT_LARGE_PREFIX = 'Portrait_'
const PORTRAIT_EXT = '.png'
function buildLargePortaitPath(name: string, tag: string) {
  return `gfx/leaders/${tag}/${PORTRAIT_LARGE_PREFIX}_${tag}_${name}${PORTRAIT_EXT}`
}
function buildSmallPortraitPath(name: string, tag: string) {
  return `gfx/ministers/${tag}/${tag}_${name}${PORTRAIT_EXT}`
}

function definePortraits(character: CharacterWithId): string {
  const { name, tag, roles } = character
  const hasCivillian = roles.includes('leader') || roles.includes('minister')
  const hasArmy = roles.includes('marshal') || roles.includes('general')
  const hasArmyWithOfficer = hasArmy || roles.includes('officer')
  const hasNavy = roles.includes('admiral')

  const portraits = ''
  if (hasCivillian) {
    const template = `
      civilian = {
        ${roles.includes('leader') && buildLargePortaitPath(name, tag)}
        ${roles.includes('minister') && buildSmallPortraitPath(name, tag)}
      }`
    portraits.concat(template)
  }
  if (hasArmyWithOfficer) {
    const template = `
      army = {
        ${hasArmy && `large = ${buildLargePortaitPath(name, tag)})`}
        ${roles.includes('officer') && `small = ${buildSmallPortraitPath(name, tag)}`}
      }`
    portraits.concat(template)
  }
  if (hasNavy) {
    const template = `
      navy = {
        large = ${buildLargePortaitPath(name, tag)}
      }`
    portraits.concat(template)
  }
  return portraits
}

function defineCountryLeader(character: CharacterWithId): string {
  return character.roles.includes('leader')
    ? `
  country_leader = {
    ideology = ${getIdeologyToken(character.ideology)}_subtype
    traits = {
      ${character.leaderTraits.join('\n')}
    }
  }`
    : ''
}

function defineCommandingRole(character: CharacterWithId): string {
  if (character.roles.includes('marshal')) {
    return `
    field_marshal = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
			attack_skill = 1
			defense_skill = 1
			planning_skill = 1
			logistics_skill = 1
    }`
  }
  if (character.roles.includes('general')) {
    return `
    corps_commander = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
			attack_skill = 1
			defense_skill = 1
			planning_skill = 1
			logistics_skill = 1
    }`
  }
  if (character.roles.includes('admiral')) {
    return `
    navy_leader = {
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

  const advisor = ''
  for (const position of positions) {
    const ideology = getIdeologyToken(character.ideology)
    const trait = ministerTraits[position as MinisterPosition]
    const idea = `${token}_${getPositionSuffix(position)}_${getIdeologySuffix(character.ideology)}`

    const template = `
    advisor = {
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
    advisor.concat(template)
  }

  return advisor
}

function defineOfficerRole(character: CharacterWithId): string {
  const { positions, ministerTraits, cost } = character
  const token = `${buildCharacterToken(character)}`

  const advisor = ''
  for (const position of positions) {
    const trait = ministerTraits[position as MinisterPosition]
    const idea = `${token}_${getPositionSuffix(position)}_${getIdeologySuffix(character.ideology)}`

    const template = `
    advisor = {
			cost = ${cost}
			slot = ${buildToken(position)}
			idea_token = ${idea}
			traits = {
				${trait}
			}
		}`
    advisor.concat(template)
  }

  return advisor
}

export default function writeCharacter(characters: CharacterWithId[]) {
  const content: string = ''
  for (const character of characters) {
    const portraits = definePortraits(character)

    const data = `
    ${buildCharacterToken(character)} = {
      name = "${character.name}"
      portraits = {
        ${portraits}
      }
      ${defineCountryLeader(character)}
      ${defineCommandingRole(character)}
      ${defineMinisterialRole(character)}
      ${defineOfficerRole(character)}
    }`
    content.concat(data)
  }
}
