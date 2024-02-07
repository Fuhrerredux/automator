const defaultIdeologies: Record<string, Omit<Ideology, 'key'>> = {
  vanguardist: { name: 'Vanguardist', short: 'van' },
  collectivist: { name: 'Collectivist', short: 'col' },
  libertarian_socialist: { name: 'Libertarian Socialist', short: 'lib' },
  social_democrat: { name: 'Social Democrat', short: 'sde' },
  social_liberal: { name: 'Social Liberal', short: 'sli' },
  market_liberal: { name: 'Market Liberal', short: 'mli' },
  social_conservative: { name: 'Social Conservative', short: 'sco' },
  authoritarian_democrat: { name: 'Authoritarian Democrat', short: 'ade' },
  paternal_autocrat: { name: 'Paternal Autocrat', short: 'pau' },
  national_populist: { name: 'National Populist', short: 'npo' },
  valkist: { name: 'Valkist', short: 'val' }
}
export default defaultIdeologies
