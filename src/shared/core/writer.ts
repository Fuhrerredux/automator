import { buildToken } from '@shared/core/data'
import { buildCharacterToken } from '@shared/utils/character'
import { groupBy } from '@shared/utils/core'
import { getIdeologySuffix } from '@shared/utils/ideology'
import { getPositionSuffix, isCivilianPosition, isMilitaryPosition } from '@shared/utils/position'
import { exists, readDir, readTextFile, writeFile, writeTextFile } from '@tauri-apps/api/fs'

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
        ${roles.includes('leader') && `large = ${buildLargePortaitPath(name, tag)}`}
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
  const roles: string[] = []
  const ideologies = Array.from(new Set(character.leaderIdeologies))
  ideologies.forEach((ideology, index) => {
    const padding = index > 0 ? '\n\t\t' : ''
    roles.push(`${padding}country_leader = {
      ideology = ${ideology}_subtype
      traits = {
        ${character.leaderTraits.join('\n')}
      }
    }`)
  })

  return roles.join('')
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
  ministerPositions.forEach((position, index) => {
    const ideology = character.ideology
    const trait = ministerTraits[position as MinisterPosition]
    const idea = `${token}_${getPositionSuffix(position)}_${getIdeologySuffix(character.ideology)}`
    const padding = index > 0 ? '\n\t\t' : ''

    const template = `${padding}advisor = {
      cost = ${cost}
      slot = ${position}
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
  })

  return advisor
}

function defineOfficerRole(character: CharacterWithId): string {
  const { positions, officerTraits, cost } = character
  const token = `${buildCharacterToken(character)}`

  let advisor = ''
  const officerPositions = positions.filter((e) => isMilitaryPosition(e))
  officerPositions.forEach((position, index) => {
    const trait = officerTraits[position as MilitaryPosition]
    const idea = `${token}_${getPositionSuffix(position)}_${getIdeologySuffix(character.ideology)}`
    const padding = index > 0 ? '\n\t\t' : ''

    const template = `${padding}advisor = {
      cost = ${cost}
      slot = ${position}
      idea_token = ${idea}
      traits = {
        ${trait}
      }
    }`
    advisor = advisor.concat(template)
  })

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

export async function exportCharacters(characters: CharacterWithId[], destination: string) {
  if (Array.isArray(characters)) {
    const grouped = groupBy(characters, 'tag')
    for (const [key, value] of Object.entries(grouped)) {
      const content = writeCharacter(value)
      const template = ` # Characters for ${key}
characters = {
${content}
}`
      await writeFile(`${destination}/characters/${key}.txt`, template)
    }
  }
}

export async function exportShine(dir: string) {
  const source = `${dir}/FX_goals.gfx`
  const file = await readTextFile(source)
  const src = file.split('\n')

  const content = new Map()
  src.forEach((str, index) => {
    if (str.includes('spriteType')) {
      if (src.length > index + 2) {
        let name = src[index + 1]
        let dir = src[index + 2]

        name = name.substring(name.indexOf('"') + 1, name.lastIndexOf('"')).trim()
        dir = dir.substring(dir.indexOf('"') + 1, dir.lastIndexOf('"')).trim()
        content.set(name, dir)
      }
    }
  })

  let shines: string[] = []
  content.forEach((value, key) => {
    let shine = `\tspriteType = {
    name = "${key}_shine"
    texturefile = "${value}"
    effectFile = "gfx/FX/buttonstate.lua"
    animation = {
      animationmaskfile = "${value}"
      animationtexturefile = "gfx/interface/goals/shine_overlay.dds"
      animationrotation = -90.0
      animationlooping = no
      animationtime = 0.75
      animationdelay = 0
      animationblendmode = "add"
      animationtype = "scrolling"
      animationrotationoffset = { x = 0.0 y = 0.0 }
      animationtexturescale = { x = 1.0 y = 1.0 }
    }

    animation = {
      animationmaskfile = "${value}"
      animationtexturefile = "gfx/interface/goals/shine_overlay.dds"
      animationrotation = 90.0
      animationlooping = no
      animationtime = 0.75
      animationdelay = 0
      animationblendmode = "add"
      animationtype = "scrolling"
      animationrotationoffset = { x = 0.0 y = 0.0 }
      animationtexturescale = { x = 1.0 y = 1.0 }
    }
    legacy_lazy_load = no
  }\n`

    if (key && value) shines.push(shine)
  })

  let shine = `spriteTypes = {
${shines.join('\n')}
}`
  await writeTextFile(`${dir}/FX_goals_shine.gfx`, shine)
}

export async function appendToHistory(characters: CharacterWithId[], destination: string) {
  if (Array.isArray(characters)) {
    const history = `${destination}/history/countries/`
    const grouped = groupBy(characters, 'tag')
    const entries = await readDir(history)

    const findHistoryFile = (tag: string) => entries.find((e) => e.name?.startsWith(tag))

    for (const [key, value] of Object.entries(grouped)) {
      const file = findHistoryFile(key)
      if (!file) continue

      const path = file.path
      let data = ''
      for (const character of value) {
        const token = buildCharacterToken(character)
        data = data.concat(`recruit_character = ${token}\n`)
      }

      let content = ''
      if (await exists(path)) {
        content = await readTextFile(path)

        content = content
          .split('\n')
          .filter((e) => !e.startsWith('recruit_character'))
          .join('\n')
      }

      content = content.concat(`\n${data}`)
      await writeTextFile(path, content)
    }
  }
}
