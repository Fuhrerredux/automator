export function getPositionSuffix(position: Position) {
  switch (position) {
    case 'head-of-government':
      return 'hog'
    case 'foreign-minister':
      return 'for'
    case 'economy-minister':
      return 'eco'
    case 'security-minister':
      return 'sec'
    case 'high-command':
      return 'cos'
    case 'army-chief':
      return 'carm'
    case 'air-chief':
      return 'cair'
    case 'navy-chief':
      return 'cnav'
  }
}

export function isCivilianPosition(position: Position) {
  return (
    position === 'head-of-government' ||
    position === 'foreign-minister' ||
    position === 'economy-minister' ||
    position === 'security-minister'
  )
}

export function isMilitaryPosition(position: Position) {
  return (
    position === 'high-command' ||
    position === 'army-chief' ||
    position === 'navy-chief' ||
    position === 'air-chief'
  )
}
