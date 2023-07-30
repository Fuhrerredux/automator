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
