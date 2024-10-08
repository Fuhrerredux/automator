import { buildToken } from '@shared/core/data'
import { buildCharacterToken } from '@shared/utils/character'
import { groupBy } from '@shared/utils/core'
import { getIdeologySuffix } from '@shared/utils/ideology'
import { getPositionSuffix } from '@shared/utils/position'
import { exists, readDir, readTextFile, writeFile, writeTextFile } from '@tauri-apps/api/fs'
import { join } from '@tauri-apps/api/path'
import { countryTags, loadCountryTags, readCharacterNames, readSpriteDefinitions } from './reader'

const PORTRAIT_LARGE_PREFIX = 'Portrait'
const PORTRAIT_EXT = '.png'

function buildLargePortaitPath(name: string, tag: string, config: Automator.Configuration) {
  return `${config.character.largePortraitPath}/${tag}/${PORTRAIT_LARGE_PREFIX}_${tag}_${buildToken(name)}${PORTRAIT_EXT}`
}
function buildSmallPortraitPath(name: string, tag: string, config: Automator.Configuration) {
  return `${config.character.smallPortraitPath}/${tag}/${tag}_${buildToken(name)}${PORTRAIT_EXT}`
}

function definePortraits(character: CharacterWithId, config: Automator.Configuration): {
  civilian?: Characters.CivilianPortrait
  army?: Characters.ArmyPortrait
  navy?: Characters.NavyPortrait
} {
  const { name, tag, roles } = character
  const slots = roles
  // a character may not have slots, we still need portrait defined
  const hasCivillian =
    !slots || slots.length === 0 || slots.includes('leader') || slots.includes('advisor')
  const hasArmy = slots && slots.some((role) => ['marshal', 'general'].includes(role))
  const hasArmyWithOfficer = slots && (hasArmy || slots.includes('officer'))
  const hasNavy = slots && slots.includes('admiral')
  let portraits: {
    civilian?: Characters.CivilianPortrait
    army?: Characters.ArmyPortrait
    navy?: Characters.NavyPortrait
  } = {}
  if (hasCivillian) {
    const portrait: Characters.CivilianPortrait = {}

    if (slots?.length === 0 || slots?.includes('leader'))
      portrait.large = buildLargePortaitPath(name, tag, config)
    if (slots?.includes('advisor')) portrait.small = buildSmallPortraitPath(name, tag, config)
    portraits.civilian = portrait
  }
  if (hasArmyWithOfficer) {
    const portrait: Characters.ArmyPortrait = {}
    if (hasArmy) portrait.large = buildLargePortaitPath(name, tag, config)
    if (slots.includes('officer')) portrait.small = buildLargePortaitPath(name, tag, config)
    portraits.army = portrait
  }
  if (hasNavy) {
    const portrait: Characters.NavyPortrait = {}
    portrait.large = buildLargePortaitPath(name, tag, config)
    portraits.navy = portrait
  }

  return portraits
}

function defineCountryLeader(character: CharacterWithId): {
  countryLeader: { ideology: string; traits: string[] }[]
} {
  const countryLeaderObjects: { ideology: string; traits: string[] }[] = []
  // set so no duplicates
  Array.from(new Set(character.leaderRoles)).forEach((e) => {
    let ideologyKey = ''
    if (typeof e.subideology === 'string') {
      ideologyKey = e.subideology
    } else if (e.subideology && typeof e.subideology === 'object' && 'key' in e.subideology) {
      ideologyKey = e.subideology['key'] //ignore error
    }
    const countryLeader = {
      ideology: `${ideologyKey}_subtype`,
      traits: Array.isArray(e.trait) ? e.trait : [e.trait]
    }
    countryLeaderObjects.push(countryLeader)
  })
  return { countryLeader: countryLeaderObjects }
}

function defineCommandingRole(character: CharacterWithId): { type: string, trait: string }[] {
  const commanderObjects: Characters.General[] = []
  Array.from(new Set(character.commanderRoles)).forEach((e) => {
    const commanderObject = {
      type: e.type,
      trait: e.trait
    }
    commanderObjects.push(commanderObject)
  })
  return commanderObjects
}

function defineAdvisorRole(
  character: CharacterWithId,
  config: Automator.Configuration,
  settings: Automator.Preference
): { advisors: Characters.AdvisorWithPositionPrevention[] } {
  const { advisorRoles, ideology } = character
  const token = buildCharacterToken(character)
  const advisors: Characters.AdvisorWithPositionPrevention[] = []
  const positionPrevention = settings.positionPrevention === false

  if (advisorRoles) {
    advisorRoles.forEach((advisor: Advisor, index) => {
      const position = advisor.slot as unknown as Automator.Position
      const usesIdeologySuffix = settings.usesIdeologySuffixOnToken
      const suffix = ideology ? getIdeologySuffix(ideology, config) : ''
      const ideaToken =
        usesIdeologySuffix && suffix != ''
          ? `${token}_${getPositionSuffix(position, config)}_${suffix}`
          : `${token}_${getPositionSuffix(position, config)}`
      const hasMoreThanOneRoles = advisorRoles.length > 1 && !positionPrevention
      const allOtherPositions = advisorRoles.filter((_, i) => i !== index)
      let advisorObject: Characters.AdvisorWithPositionPrevention = {
        slot: advisor.slot,
        hirable: advisor.hirable,
        removeable: advisor.removeable,
        trait: advisor.trait,
        cost: advisor.cost,
        ideaToken: ideaToken,
        positionPrevention: hasMoreThanOneRoles
          ? `\n${allOtherPositions.map((otherPosition) => `                NOT = { is_character_slot = ${otherPosition.slot}`).join('\n')} }`
          : ''
      }
      advisors.push(advisorObject)
    })
  }
  return { advisors }
}

export function writeCharacter(characters: CharacterWithId[], config: Automator.Configuration, settings: Automator.Preference) {
  let content: string = ''
  for (const character of characters) {
    const portraitsData = definePortraits(character, config)
    let portraitsBlock = ''
    let isFirstBlock = true
    for (const [type, portrait] of Object.entries(portraitsData)) {
      // Check if the current portrait type exists and if it has either small or large portrait path
      if (portrait && (portrait.small || portrait.large)) {
        // Construct the portrait block for the current type
        if (!isFirstBlock) {
          portraitsBlock += '\n\t'
        }
        portraitsBlock += `        ${type} = {\n`
        if (portrait.large) {
          portraitsBlock += `\t\t\t\tlarge = "${portrait.large}"\n`
        }
        if (portrait.small) {
          portraitsBlock += `\t\t\t\tsmall = "${portrait.small}"\n`
        }
        portraitsBlock += `\t\t\t}`
        isFirstBlock = false
      }
    }
    const leaders = defineCountryLeader(character)
    const commanding: { type: string, trait: string }[] = defineCommandingRole(character)
    const minister = defineAdvisorRole(character, config, settings)
    let rolesBlock = ''

    if (leaders.countryLeader && leaders.countryLeader.length > 0) {
      leaders.countryLeader.forEach((leader) => {
        rolesBlock += `\n\t\tcountry_leader = {
        \tideology = ${leader.ideology}
        \ttraits = { ${leader.traits} }
        }`
      })
    }

    commanding.forEach((commander) => {
      rolesBlock += `
          \n\t\t${commander.type} = {
            traits = { ${commander.trait} }
            skill = 1
            attack_skill = 1
            defense_skill = 1
            ${
              commander.type === 'admiral'
                ? `maneuvering_skill = 1\n\t\t\tcoordination_skill = 1`
                : `planning_skill = 1\n\t\t\tlogistics_skill = 1`
            }
        }`
    })
    rolesBlock = rolesBlock
      .replace('marshal', 'field_marshal')
      .replace('general', 'corps_commander')
      .replace('admiral', 'navy_leader')

    minister.advisors.forEach((advisor) => {
      let available = ''
      if (!advisor.hirable) {
        available += `
                ROOT = { has_country_flag = ${advisor.ideaToken}_hired }
          `
      }
      if (advisor.positionPrevention) {
        available += `
              ${advisor.positionPrevention}
          `
      }
      rolesBlock += `
        advisor = {
            cost = ${advisor.cost}
            slot = ${advisor.slot}
            idea_token = ${advisor.ideaToken}
            available = {
              ${available}
            } 
            ${
              !advisor.hirable
                ? `
            on_add = { ROOT = { set_country_flag = ${advisor.ideaToken}_hired } }
            on_remove = { ROOT = { clr_country_flag = ${advisor.ideaToken}_hired } }`
                : ''
            }
            ${advisor.removeable ? `\n\t\t\tcan_be_fired = no` : ''}
            traits = { ${character.ideology ? character.ideology : ''} ${advisor.trait} }
        }
      `
    })

    const lines = rolesBlock.split('\n')
    rolesBlock =
      lines[0] +
      '\n' +
      lines
        .slice(1)
        .filter((line) => line.trim() !== '')
        .join('\n')

    let data = `\t${buildCharacterToken(character)} = {
        name = "${character.name}"
        portraits = {
    ${portraitsBlock}
        }
${rolesBlock}
    }\n`
    content = content.concat(data)
  }

  return content
}

export async function exportCharacters(
  characters: CharacterWithId[],
  destination: string,
  config: Automator.Configuration,
  settings: Automator.Preference
) {
  if (Array.isArray(characters)) {
    const grouped = groupBy(characters, 'tag')
    for (const [key, value] of Object.entries(grouped)) {
      const content = writeCharacter(value, config, settings)
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

export async function eventLogging(content: string, path: string, settings: Automator.Preference): Promise<void> {
  const newContent: string[] = []
  const lines = content.split('\n') //split lines
  const optionLogging: boolean = settings.optionLogging === true //if we log or not log options
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

export async function appendCharLoc(content: string, locDir: string, config: Automator.Configuration, commonDir: string, filePath: string) {
  const names: Characters.NameLoc[] = await readCharacterNames(content);
  const lines = content.split('\n')
  const tag = (lines.slice(1, -1))[0].trim().substring(0, 3)
  const locs: string[] = []
  locDir = await join(locDir, 'english', config.localisation.countryDir)
  // Read directory and find matching files
  const locFiles = await readDir(locDir);
  for (const file of locFiles) {
    if (file.name?.includes(tag)) {
      let locContent = await readTextFile(file.path);
      locContent += "\n\n# Characters\n\n"
      await writeTextFile(file.path, locContent);

      for (const nameLoc of names) {
        const { name, scope } = nameLoc;
        const format = `${scope.trim()}: ${name.trim()}`;
        locs.push(format)
      }

      await writeTextFile(file.path, locContent + locs.join('\n'))
    }
  }

  let curLoc: string = ''
  const newLines: string[] = []
  let newLine: string = ''
  lines.forEach((line) => {
    newLine = line
    if (line.trim().startsWith(tag)) {
      curLoc = line.trim().replace('{', '').replace('=', '').trim()
    } else if (line.includes('name')) {
      newLine = line.replace(line.substring(line.trim().indexOf('=') + 3, line.length), '')
      newLine += ` ${curLoc.trim()}`
    }
    newLines.push(newLine)
  })
  await writeTextFile(`${await join(commonDir, 'characters', filePath)}`, newLines.join('\n'))
}

// export async function appendCharacterLocalisation(
//   characters: CharacterWithId[],
//   path: string,
//   content: string,
//   commonDir: string
// ): Promise<void> {
//   if (Array.isArray(characters)) {
//     const group = groupBy(characters, 'tag')
//     let data: string = ''
//     for (const [_, value] of Object.entries(group)) {
//       for (const character of value) {
//         const characterPath = `${commonDir}/characters/${character.tag}.txt`
//         const token = buildCharacterToken(character)
//         if (!content.includes(`${token}: "${character.name}"`)) {
//           data = data.concat(`  ${token}: "${character.name}"\n`)
//         }
//         const charContent = await readTextFile(characterPath)
//         const lines = charContent.split('\n')
//         const newcharContent: string[] = []
//         lines.forEach((line, _) => {
//           let nLine = line
//           if (/\bname\b/.test(line)) {
//             nLine = `        ${line.split('=')[0].trim()} = ${token}\n`
//           }
//           newcharContent.push(nLine)
//         })
//         const result = newcharContent.join('\n')
//         try {
//           await writeTextFile(characterPath, result)
//         } catch (error) {
//           console.error(`Error writing file ${characterPath}: ${error}`)
//           throw error
//         }
//       }
//     }
//     if (data !== '') {
//       const comment = '\n\n### Generated Character Names ###\n'
//       content = content.concat(`${comment}\n${data}`)
//       try {
//         await writeTextFile(path, content)
//       } catch (error) {
//         console.error(`Error writing file ${path}: ${error}`)
//         throw error
//       }
//     }
//   }
// } for use within char editor

export async function fixSprites(path: string, content: string, commonDir: string): Promise<void> {
  await loadCountryTags(`${commonDir}/country_tags/00_countries.txt`)
  const spriteTypes: SpriteEntryWithTag[] = extractSpriteTypes(content)

  assignTagIndexes(spriteTypes)

  sortSpriteTypes(spriteTypes)

  const spriteTypesBlock = generateSpriteTypesBlock(spriteTypes)

  try {
    await writeTextFile(path, spriteTypesBlock)
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

export async function localiseFocuses(outputPath: string, content: string): Promise<void> {
  let focuses: Focus[] = []
  let prevLine: string = ''
  const addedKeys = new Set<string>()
  content.split('\n').forEach((line, _) => {
    if (prevLine && prevLine.includes('focus = {') && line.includes('id')) {
      const id = `${
        line
          .substring(line.indexOf('=') + 1)
          .trim()
          .split('#')[0]
      }`
      focuses.push({ id })
    }
    prevLine = line
  })
  let outputFile = await readTextFile(outputPath)
  let bom = ''
  if (outputFile.charCodeAt(0) === 0xfeff) {
    // Check if BOM exists
    bom = '\uFEFF'
    outputFile = outputFile.slice(1) // Remove BOM
  }
  let updatedOutputFile = ''
  const generatedLoc = '\n\n# Generated\n\n'
  updatedOutputFile += generatedLoc

  focuses.forEach(({ id }) => {
    const idKey = `${id}: ""`
    const descKey = `${id}_desc: ""`
    const idKeyFind = `${id}`
    const descKeyFind = `${id}_desc`

    // Check if idKey or descKey already exist in the outputFile or have been added
    if (!addedKeys.has(idKeyFind) && !outputFile.includes(idKeyFind)) {
      const idPattern = new RegExp(`\\b${id}\\b`)
      if (
        outputFile.split('\n').includes(idKeyFind) &&
        !outputFile.split('\n').includes(descKeyFind)
      ) {
        let index = outputFile.split('\n').findIndex((line) => line.includes(idKeyFind))
        updatedOutputFile.split('\n')[index] += `\n${descKey}`
        addedKeys.add(descKey)
      } else if (!outputFile.split('\n').some((line) => idPattern.test(line))) {
        updatedOutputFile += `${idKey}\n`
        addedKeys.add(idKey)
      }
    }
    if (!addedKeys.has(descKeyFind) && !outputFile.includes(descKeyFind)) {
      const descPattern = new RegExp(`\\b${id}_desc\\b`)
      if (
        outputFile.split('\n').includes(descKeyFind) &&
        !outputFile.split('\n').includes(idKeyFind)
      ) {
        let index = outputFile.split('\n').findIndex((line) => line.includes(descKeyFind))
        updatedOutputFile.split('\n')[index] += `\n${idKey}`
        addedKeys.add(idKey)
      } else if (!outputFile.split('\n').some((line) => descPattern.test(line))) {
        updatedOutputFile += `${descKey}\n`
        addedKeys.add(descKey)
      }
    }
  })
  await writeTextFile(outputPath, bom + outputFile + updatedOutputFile)
}
