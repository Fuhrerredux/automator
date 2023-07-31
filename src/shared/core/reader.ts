import { getPositionSuffix } from '@shared/utils/position'

export function extractTraits(content: string): Record<Position, string[]> {
  const traits: Record<Position, string[]> = {
    'head-of-government': [],
    'foreign-minister': [],
    'economy-minister': [],
    'security-minister': [],
    'high-command': [],
    'army-chief': [],
    'navy-chief': [],
    'air-chief': []
  }

  const extract = (prefix: string, s: string) => {
    const safePrefix = `${prefix}_`
    const trait = s.substring(s.indexOf(safePrefix), s.indexOf('='))
    return trait.trim()
  }

  content.split('\n').forEach((e) => {
    for (const key of Object.keys(traits)) {
      const prefix = getPositionSuffix(key as Position)
      if (e.includes(prefix)) {
        const arr = traits[key as Position]
        arr.push(extract(prefix, e))
        traits[key as Position] = arr
      }
    }
  })

  return traits
}
