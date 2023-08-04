import { buildToken } from '@shared/core/data'

const ideologies: Ideology[] = [
  'vanguardist',
  'collectivist',
  'libertarian_socialist',
  'social_democrat',
  'social_liberal',
  'market_liberal',
  'social_conservative',
  'authoritarian_democrat',
  'paternal_autocrat',
  'national_populist',
  'valkist'
]

export function getIdeologyToken(ideology: Ideology): string {
  return buildToken(ideology)
}

export function getIdeologySuffix(ideology: Ideology): string {
  switch (ideology) {
    case 'vanguardist':
      return 'van'
    case 'collectivist':
      return 'col'
    case 'libertarian_socialist':
      return 'lib'
    case 'social_democrat':
      return 'sde'
    case 'social_liberal':
      return 'sli'
    case 'market_liberal':
      return 'mli'
    case 'social_conservative':
      return 'sco'
    case 'authoritarian_democrat':
      return 'ade'
    case 'paternal_autocrat':
      return 'pau'
    case 'national_populist':
      return 'npo'
    case 'valkist':
      return 'val'
  }
}

export function isIdeologyToken(ideology: string) {
  return ideologies.includes(ideology.trim() as Ideology)
}
