export function getPositionSuffix(position: Position) {
  switch (position) {
    case 'head_of_government':
      return 'hog'
    case 'foreign_minister':
      return 'for'
    case 'economy_minister':
      return 'eco'
    case 'security_minister':
      return 'sec'
    case 'high_command':
      return 'cos'
    case 'army_chief':
      return 'carm'
    case 'air_chief':
      return 'cair'
    case 'navy_chief':
      return 'cnav'
  }
}

export function isCivilianPosition(position: Position) {
  return (
    position === 'head_of_government' ||
    position === 'foreign_minister' ||
    position === 'economy_minister' ||
    position === 'security_minister'
  )
}

export function isMilitaryPosition(position: Position) {
  return (
    position === 'high_command' ||
    position === 'army_chief' ||
    position === 'navy_chief' ||
    position === 'air_chief'
  )
}

export function parsePosition(position: string | null | undefined): Position | null {
  switch (position) {
    case 'hog':
      return 'head_of_government'
    case 'for':
      return 'foreign_minister'
    case 'eco':
      return 'economy_minister'
    case 'sec':
      return 'security_minister'
    case 'cos':
      return 'high_command'
    case 'carm':
      return 'army_chief'
    case 'cnav':
      return 'navy_chief'
    case 'cair':
      return 'air_chief'
    default:
      return null
  }
}
