// update when necessary
const configurationKeys = ['ideologies', 'positions', 'character']

export function validateConfiguration(data: object): data is Automator.Configuration {
  return Object.keys(data).every((key) => configurationKeys.includes(key))
}
