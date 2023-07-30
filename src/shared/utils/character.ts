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
    role === 'head-of-government' ||
    role === 'foreign-minister' ||
    role === 'economy-minister' ||
    role === 'security-minister'
  )
}

export function getMinisterialRoles(character: CharacterWithId): MinisterPosition[] {
  return character.positions.filter((e) => isMinisterialRole(e)) as MinisterPosition[]
}

export function isOfficerRole(role: Position): boolean {
  return (
    role === 'high-command' ||
    role === 'army-chief' ||
    role === 'navy-chief' ||
    role === 'air-chief'
  )
}

export function getOfficerRole(character: CharacterWithId): MilitaryPosition[] {
  return character.positions.filter((e) => isOfficerRole(e)) as MilitaryPosition[]
}

export function buildCharacterToken(character: CharacterWithId): string {
  return `${character.tag}_${character.name}`
}
