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
