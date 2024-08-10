import { commanding } from '../const/roles'
import { buildToken } from '../core/data'

export function toFormData(
  { ideology, roles, ...rest }: Character,
  config: Automator.Configuration
): CharacterForm {
  const ideologies: Automator.Ideology[] = Object.entries(config.ideologies).map(
    ([key, value]) => ({
      key,
      name: value.name,
      short: value.short
    })
  )

  return { // ![here++]
    ...rest,
    ideology: ideologies.find((e) => e.key === ideology)?.key ?? null,
    addLeaderRole: roles.includes('leader'),
    addCommanderRole:
      roles.includes('marshal') || roles.includes('admiral') || roles.includes('general'),
    addAdvisorRole: roles.includes('advisor')
  }
}

/**
 * Function to convert form data to a character object
 * that can be flushed to the database.
 *
 * @param {CharacterForm} character character form data
 * @returns converted character object
 */
export function fromFormData(character: CharacterForm): Character {
  const {
    name,
    tag,
    ideology,
    leaderRoles,
    commanderRoles,
    addCommanderRole,
    addLeaderRole,
    addAdvisorRole,
    advisorRoles,
    // commanderRole
  } = character
  const roles: CharacterRole[] = []
  if (addLeaderRole) roles.push('leader')
  if (addCommanderRole && commanderRoles) roles.push(...commanderRoles.map(commander => commander.type))
  if (addAdvisorRole) roles.push('advisor')

  return {
    name,
    tag,
    leaderRoles,
    commanderRoles,
    roles,
    advisorRoles,
    ideology: typeof ideology === 'object' && ideology ? ideology.key : ideology
  }
}

export function isCommandingRole(role: CharacterRole): boolean {
  return role === 'marshal' || role === 'general' || role === 'admiral'
}

export function hasCommandingRole(character: CharacterWithId): boolean {
  return character.roles.some((e) => isCommandingRole(e))
}

export function getCommandingRole(character: CharacterWithId): CommandingRole | null {
  return (character.roles.find((e) => isCommandingRole(e)) as CommandingRole) || null
}

export function buildCharacterToken(character: CharacterWithId): string {
  return `${character.tag}_${buildToken(character.name)}`
}
