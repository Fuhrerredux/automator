export function getPositionSuffix(position: Automator.Position, config: Automator.Configuration) {
  const positions = config.positions
  const short = positions[`${position}`].short || ''
  if (short) return short

  return ''
}

export function isAdvisorPosition(position: string, config: Automator.Configuration): boolean {
  return Object.keys(config.positions).includes(position)
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
