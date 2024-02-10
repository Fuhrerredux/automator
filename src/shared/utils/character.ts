import { buildToken } from '@shared/core/data'

export function fromFormData(character: CharacterForm): Character {
  const {
    name,
    tag,
    ideology,
    leaderTraits,
    leaderIdeologies,
    commanderTraits,
    ministerTraits,
    officerTraits,
    addCommanderRole,
    addLeaderRole,
    addMinisterRole,
    addOfficerRole,
    commanderRole,
    ministerRoles,
    officerRoles
  } = character
  const roles: CharacterRole[] = []
  if (addLeaderRole) roles.push('leader')
  if (addCommanderRole && commanderRole?.value) roles.push(commanderRole.value)
  if (addMinisterRole) roles.push('minister')
  if (addOfficerRole) roles.push('officer')

  const ministerRolesKeys = Object.entries(ministerRoles)
    .filter(([_, value]) => value)
    .map(([key]) => key)
  const officerRolesKeys = Object.entries(officerRoles)
    .filter(([_, value]) => value)
    .map(([key]) => key)

  const positions: Position[] = ministerRolesKeys.concat(officerRolesKeys) as Position[]

  return {
    name,
    tag,
    leaderIdeologies,
    leaderTraits,
    commanderTraits,
    ministerTraits,
    officerTraits,
    positions,
    cost: 150,
    roles,
    ideology: ideology ? ideology.key : null
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

export function isMinisterialRole(role: Position): boolean {
  return (
    role === 'head_of_government' ||
    role === 'foreign_minister' ||
    role === 'economy_minister' ||
    role === 'security_minister'
  )
}

export function getMinisterialRoles(character: CharacterWithId): MinisterPosition[] {
  return character.positions.filter((e) => isMinisterialRole(e)) as MinisterPosition[]
}

export function isOfficerRole(role: Position): boolean {
  return (
    role === 'high_command' ||
    role === 'army_chief' ||
    role === 'navy_chief' ||
    role === 'air_chief' ||
    role === 'theorist'
  )
}

export function getOfficerRole(character: CharacterWithId): MilitaryPosition[] {
  return character.positions.filter((e) => isOfficerRole(e)) as MilitaryPosition[]
}

export function buildCharacterToken(character: CharacterWithId): string {
  return `${character.tag}_${buildToken(character.name)}`
}
