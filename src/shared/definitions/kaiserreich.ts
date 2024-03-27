/** @type{Automator.Configuration} */
export default {
  ideologies: {
    totalist: { name: 'Totalist' },
    syndicalist: { name: 'Syndicalist' },
    radical_socialist: { name: 'Radical Socialist' },
    social_democrat: { name: 'Social Democrat' },
    social_liberal: { name: 'Social Liberal' },
    market_liberal: { name: 'Market Liberal' },
    social_conservative: { name: 'Social Conservative' },
    authoritarian_democrat: { name: 'Authoritarian Democrat' },
    paternal_autocrat: { name: 'Paternal Autocrat' },
    national_populist: { name: 'National Populist' }
  },
  positions: {
    advisor: { name: 'Advisor' },
    high_command: { name: 'Chief of Staff', short: 'cos' },
    army_chief: { name: 'Chief of Army', short: 'carm' },
    air_chief: { name: 'Chief of Air Force', short: 'cair' },
    navy_chief: { name: 'Chief of Navy', short: 'cnav' },
    theorist: { name: 'Theorist', short: 'theo' }
  },
  character: {
    defaultCost: 150,
    largePortraitPath: 'gfx/leaders',
    smallPortraitPath: 'gfx/interface/advisors'
  }
}
