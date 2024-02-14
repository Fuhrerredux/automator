export function getPositionSuffix(position: Automator.Position, config: Automator.Configuration) {
  const positions = config.positions
  const short = positions[`${position}`].short
  if (short) return short

  return ''
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
    position === 'air_chief' ||
    position === 'theorist'
  )
}

export function parsePosition(
  position: string | null | undefined,
  config: Automator.Configuration
): Automator.Position | null {
  if (!position) return null

  const parsedPosition: Automator.Position = {
    ...config.positions[position],
    key: position
  }
  return parsedPosition
}
