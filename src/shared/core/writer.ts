import useModStore from '@/stores/mod'
import useSettingsStore from '@/stores/settings'
import { buildToken } from '@shared/core/data'
import { buildCharacterToken } from '@shared/utils/character'
import { groupBy } from '@shared/utils/core'
import { getIdeologySuffix } from '@shared/utils/ideology'
import { getPositionSuffix, isCivilianPosition, isMilitaryPosition } from '@shared/utils/position'
import { exists, readDir, readTextFile, writeFile, writeTextFile } from '@tauri-apps/api/fs'
import { loadCountryTags, readSpriteDefinitions, countryTags } from './reader'

const PORTRAIT_LARGE_PREFIX = 'Portrait'
const PORTRAIT_EXT = '.png'
function buildLargePortaitPath(name: string, tag: string) {
  return `gfx/leaders/${tag}/${PORTRAIT_LARGE_PREFIX}_${tag}_${buildToken(name)}${PORTRAIT_EXT}`
}
function buildSmallPortraitPath(name: string, tag: string) {
  return `gfx/interface/ministers/${tag}/${tag}_${buildToken(name)}${PORTRAIT_EXT}`
}

function definePortraits(character: CharacterWithId): string {
  const { name, tag, roles } = character
  const hasCivillian = roles.includes('leader') || roles.includes('minister')
  const hasArmy = roles.includes('marshal') || roles.includes('general')
  const hasArmyWithOfficer = hasArmy || roles.includes('officer')
  const hasNavy = roles.includes('admiral')

  let portraits = ''
  if (hasCivillian) {
    let template = '\t\t\tcivilian = {'

    if (roles.includes('leader'))
      template = template.concat(`\n\t\t\t\tlarge = "${buildLargePortaitPath(name, tag)}"`)
    if (roles.includes('minister'))
      template = template.concat(`\n\t\t\t\tsmall = "${buildSmallPortraitPath(name, tag)}"`)

    template = template.concat('\n\t\t\t}')
    portraits = portraits.concat(template)
  }
  if (hasArmyWithOfficer) {
    let template = ''
    // spacing issues
    if (hasCivillian) template = '\n'
    template = template.concat('\t\t\tarmy = {')

    if (hasArmy)
      template = template.concat(`\n\t\t\t\tlarge = "${buildLargePortaitPath(name, tag)}"`)
    if (roles.includes('officer'))
      template = template.concat(`\n\t\t\t\tsmall = "${buildSmallPortraitPath(name, tag)}"`)

    template = template.concat('\n\t\t\t}')
    portraits = portraits.concat(template)
  }
  if (hasNavy) {
    let template = `\n\t\t\tnavy = {
        large = ${buildLargePortaitPath(name, tag)}
      }`
    portraits = portraits.concat(template)
  }
  return portraits
}

function defineCountryLeader(character: CharacterWithId): string {
  const roles: string[] = []
  const ideologies = Array.from(new Set(character.leaderIdeologies))
  ideologies.forEach((ideology) => {
    roles.push(`\n\t\tcountry_leader = {
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
    return `\n\t\tfield_marshal = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
      attack_skill = 1
      defense_skill = 1
      planning_skill = 1
      logistics_skill = 1
    }`
  }
  if (character.roles.includes('general')) {
    return `\n\t\tcorps_commander = {
      traits = { ${character.commanderTraits.join(' ')} }
      skill = 1
      attack_skill = 1
      defense_skill = 1
      planning_skill = 1
      logistics_skill = 1
    }`
  }
  if (character.roles.includes('admiral')) {
    return `\n\t\tnavy_leader = {
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
  ministerPositions.forEach((position) => {
    const ideology = character.ideology
    const trait = ministerTraits[position as MinisterPosition]
    const suffix = ideology ? getIdeologySuffix(ideology) : ''
    const idea = `${token}_${getPositionSuffix(position)}_${suffix}`

    const template = `\n\t\tadvisor = {
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
  const positionPrevention = useSettingsStore().$state.positionPrevention

  let advisor = ''
  const officerPositions = positions.filter((e) => isMilitaryPosition(e))

  officerPositions.forEach((position, index) => {
    const trait = officerTraits[position as MilitaryPosition]
    const idea = `${token}_${getPositionSuffix(position)}`
    const hasMoreThanOneRoles = officerPositions.length > 1 && !positionPrevention

    // Add the position to the new array
    const allOtherPositions = officerPositions.filter((_, i) => i !== index)

    const availableBlock = hasMoreThanOneRoles
      ? `available = {\n${allOtherPositions.map((otherPosition) => `        is_${otherPosition} = no`).join('\n')}\n      }`
      : ''

    // Add available block inline before traits conditionally
    const templateWithAvailable = `\n\t\tadvisor = {
      cost = ${cost}
      slot = ${position}
      idea_token = ${idea}
      ${availableBlock}
      traits = {
        ${trait}
      }
    }`

    advisor = advisor.concat(templateWithAvailable)
  })
  const lines = advisor.split('\n')
  advisor =
    lines[0] +
    '\n' +
    lines
      .slice(1)
      .filter((line) => line.trim() !== '')
      .join('\n')

  return advisor
}

export function writeCharacter(characters: CharacterWithId[]) {
  let content: string = ''
  for (const character of characters) {
    const portraits = definePortraits(character)
    const hasLeaderRole = character.roles.includes('leader')

    let data = `\t${buildCharacterToken(character)} = {
    name = "${character.name}"
    portraits = {
${portraits}
    }`

    const leaders = defineCountryLeader(character)
    const commanding = defineCommandingRole(character)
    const minister = defineMinisterialRole(character)
    const officer = defineOfficerRole(character)

    if (hasLeaderRole && leaders.trim().length > 0) data = data.concat(leaders)
    if (commanding.trim().length > 0) data = data.concat(commanding)
    if (minister.trim().length > 0) data = data.concat(minister)
    if (officer.trim().length > 0) data = data.concat(officer)

    data = data.concat('\n\t}\n')
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

export async function writeSprites(sprites: Sprite[], out: string) {
  const content: string[] = []
  sprites.forEach((e) => {
    let template = `\tspriteType = {
    name = "${e.name}"
    texturefile = "${e.path}"
  }`

    if (e.name.trim().length > 0 && e.path.trim().length > 0) content.push(template)
  })

  let shine = `# Generated\nspriteTypes = {
${content.join('\n')}
}`
  await writeTextFile(out, shine)
}

export async function exportShine(content: string, out: string) {
  const sprites = readSpriteDefinitions(content)

  let shines: string[] = []
  sprites.forEach(({ name, path }) => {
    let shine = `\tspriteType = {
    name = "${name}_shine"
    texturefile = "${path}"
    effectFile = "gfx/FX/buttonstate.lua"
    animation = {
      animationmaskfile = "${path}"
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
      animationmaskfile = "${path}"
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

    shines.push(shine)
  })

  let shine = `spriteTypes = {
${shines.join('\n')}
}`
  await writeTextFile(out, shine)
}

export async function removeLogging(content: string, path: string): Promise<void> {
  const lines = content
    .split('\n')
    .filter((e) => !/\blog\b/.test(e))
    .join('\n') //split, filter on if it includes word 'log' (using regex so it is a word match and words that include log in their letters not match), and after join.
  try {
    await writeTextFile(path, lines)
  } catch (error) {
    console.error(`Error writing file ${path}: ${error}`)
    throw error
  }
}

export async function eventLogging(content: string, path: string): Promise<void> {
  const newContent: string[] = []
  const lines = content.split('\n') //split lines
  const optionLogging: boolean = useSettingsStore().$state.optionLogging //if we log or not log options
  let eventId: string
  lines.forEach((line, _) => {
    //iterate through each line
    let nLine = line //variable used so we have a back-up of our value

    //if line includes 'id' as a word match (so hidden_effect for example doesn't get matched), does not include days (is an event triggered on an option block), and does not start with # (so it is not a comment)
    if (/\bid\b/.test(line) && !line.includes('days') && !line.trim().startsWith('#')) {
      //substring with the index of equals, trim it, split it into the # (so we check for comments), take the 1st part, and replace all spaces with nothing. After, add a space on the equals so the resulting log says event = id and not event =id, and trim
      const id = line
        .substring(line.indexOf('='))
        .trim()
        .split('#')[0]
        .replace(' ', '')
        .replace(/=([a-zA-Z])/g, '= $1')
        .trim() //trimming 2 times because if you don't trim the 1st time it will match the wrong ids
      eventId = id
      nLine = `${line}\n    immediate = { log = "[GetLogInfo]: event ${id}" }`
      // if line includes name as a word match, does not start with a comment and optionLogging setting is on
    } else if (optionLogging && /\bname\b/.test(line) && !line.trim().startsWith('#')) {
      //same logic with const id in the if statement
      const name = line
        .substring(line.indexOf('='))
        .trim()
        .split('#')[0]
        .replace(' ', '')
        .replace(/=([a-zA-Z])/g, '= $1')
        .trim()
      nLine = `        log = "[GetLogInfo]: event ${eventId} option ${name}"\n${line}`
    }
    newContent.push(nLine)
  })
  const result = newContent.join('\n')
  try {
    await writeTextFile(path, result)
  } catch (error) {
    console.error(`Error writing file ${path}: ${error}`)
    throw error
  }
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

export async function appendCharacterLocalisation(
  characters: CharacterWithId[],
  path: string,
  content: string
): Promise<void> {
  if (Array.isArray(characters)) {
    const group = groupBy(characters, 'tag')
    let data = ''
    const commonDir = useModStore().getCommonDirectory
    for (const [_, value] of Object.entries(group)) {
      for (const character of value) {
        console.log(useModStore().getCommonDirectory)
        console.log(character.tag)
        const characterPath = `${commonDir?.path}/characters/${character.tag}.txt`
        const token = buildCharacterToken(character)
        if (!content.includes(`${token}: "${character.name}"`)) {
          data = data.concat(`  ${token}: "${character.name}"\n`)
        }
        const charContent = await readTextFile(characterPath)
        const lines = charContent.split('\n')
        const newcharContent: string[] = []
        lines.forEach((line, _) => {
          let nLine = line
          if (/\bname\b/.test(line)) {
            nLine = `        ${line.split('=')[0].trim()} = ${token}\n`
          }
          newcharContent.push(nLine)
        })
        const result = newcharContent.join('\n')
        try {
          await writeTextFile(characterPath, result)
        } catch (error) {
          console.error(`Error writing file ${characterPath}: ${error}`)
          throw error
        }
      }
    }
    if (data !== '') {
      const comment = '\n\n### Generated Character Names ###\n'
      content = content.concat(`${comment}\n${data}`)
      try {
        await writeTextFile(path, content)
      } catch (error) {
        console.error(`Error writing file ${path}: ${error}`)
        throw error
      }
    }
  }
}

export async function fixSprites(path: string, content: string): Promise<void> {
  await loadCountryTags(`${useModStore().getCommonDirectory?.path}/country_tags/00_countries.txt`)
  const spriteTypes: SpriteEntryWithTag[] = extractSpriteTypes(content)

  assignTagIndexes(spriteTypes)

  sortSpriteTypes(spriteTypes)

  const spriteTypesBlock = generateSpriteTypesBlock(spriteTypes)

  try {
    await writeTextFile(path, spriteTypesBlock)
    console.log('Sprites have been fixed and written to file successfully.')
  } catch (error) {
    console.error('Error occurred while writing sprites to file:', error)
  }
}

function assignTagIndexes(spriteTypes: SpriteEntryWithTag[]): void {
  spriteTypes.forEach((sprite) => {
    const tagIndex = sprite.tag ? countryTags.indexOf(sprite.tag) : -1
    sprite.tagIndex = tagIndex !== -1 ? tagIndex : countryTags.length
  })
}

function sortSpriteTypes(spriteTypes: SpriteEntryWithTag[]): void {
  spriteTypes.sort((a, b) => {
    if (a.tagIndex !== b.tagIndex) {
      return a.tagIndex! - b.tagIndex!
    } else {
      return a.name.localeCompare(b.name)
    }
  })
}

function extractSpriteTypes(content: string): SpriteEntryWithTag[] {
  const regex: RegExp = /spriteType\s*=\s*{\s*name\s*=\s*"(.*?)".+?texturefile\s*=\s*"(.*?)"/gis
  const spriteTypes: SpriteEntryWithTag[] = []
  const existingSpriteTypes: Set<string> = new Set()

  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    const name = match[1]
    const texturefile = match[2]
    const spriteKey = name + texturefile

    if (!existingSpriteTypes.has(spriteKey)) {
      const tag = extractTagFromName(name)
      spriteTypes.push({ name, texturefile, tag })
      existingSpriteTypes.add(spriteKey)
    }
  }

  return spriteTypes
}

function extractTagFromName(name: string): string | undefined {
  const match = name.match(/(?:ideas_|goals_|focus_)([A-Z]{3})/)
  return match ? match[1] : undefined
}

function generateSpriteTypesBlock(spriteTypes: SpriteEntry[]): string {
  const sprites: string[] = spriteTypes.map(({ name, texturefile }) => {
    return `\tspriteType = {
        name = "${name}"
        texturefile = "${texturefile}"
    }`
  })

  return `spriteTypes = {
${sprites.join('\n')}
}`
}
