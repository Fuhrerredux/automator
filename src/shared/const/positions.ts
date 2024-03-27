const defaultPositions: Record<string, Omit<Automator.Position, 'key'>> = {
  head_of_government: {
    name: 'Head of Government',
    short: 'hog',
    hirable: false,
    removable: false
  },
  foreign_minister: {
    name: 'Foreign Minister',
    short: 'for',
    hirable: false,
    removable: false
  },
  economy_minister: {
    name: 'Economy Minister',
    short: 'eco',
    hirable: false,
    removable: false
  },
  security_minister: {
    name: 'Security Minister',
    short: 'sec',
    hirable: false,
    removable: false
  },
  high_command: { name: 'Chief of Staff', short: 'cos' },
  army_chief: { name: 'Chief of Army', short: 'carm' },
  air_chief: { name: 'Chief of Air Force', short: 'cair' },
  navy_chief: { name: 'Chief of Navy', short: 'cnav' },
  theorist: { name: 'Theorist', short: 'theo' }
}

export default defaultPositions
