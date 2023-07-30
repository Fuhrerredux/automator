import { buildToken } from '@shared/core/data'

export function getIdeologyToken(ideology: Ideology): string {
  return buildToken(ideology)
}

export function getIdeologySuffix(ideology: Ideology): string {
  switch (ideology) {
    case 'vanguardist':
      return 'van'
    case 'collectivist':
      return 'col'
    case 'libertarian-socialist':
      return 'lib'
    case 'social-democrat':
      return 'sde'
    case 'social-liberal':
      return 'sli'
    case 'market-liberal':
      return 'mli'
    case 'social-conservative':
      return 'sco'
    case 'authoritarian-democrat':
      return 'ade'
    case 'paternal-autocrat':
      return 'pau'
    case 'national-populist':
      return 'npo'
    case 'valkist':
      return 'val'
  }
}
