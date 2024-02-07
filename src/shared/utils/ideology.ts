/**
 * Function used to get the ideology from the definitions
 * in the configuration object.
 *
 * @param key the ideology key
 * @param config the configuration object from the useConfigurationStore
 * @returns the ideology
 */
export function getIdeology(key: string | null, config: Automator.Configuration): Ideology | null {
  if (key) {
    const ideology = config.ideologies[key]
    if (ideology) return { ...ideology, key }
  }
  return null
}

/**
 * Function used to get the ideology suffix or the short name from the
 * definitions in the configuration object.
 *
 * @param key the ideology key
 * @param config the configuration object from the useConfigurationStore
 * @returns the ideology suffix
 */
export function getIdeologySuffix(key: string | null, config: Automator.Configuration): string {
  return getIdeology(key, config)?.short ?? ''
}

/**
 * Function used to check whether the ideology key provided is part
 * on the ideology definitions in the configuration.
 *
 * @param ideology the ideology key
 * @param config the configuration object from the useConfigurationStore
 * @returns the ideology suffix
 */
export function isIdeologyToken(ideology: string, config: Automator.Configuration): boolean {
  return Object.keys(config.ideologies).includes(ideology)
}

/**
 * Function used to parse the ideology shortname to the ideology
 * object
 *
 * @param ideology the ideology short name
 * @param config the configuration object from the useConfigurationStore
 * @returns the ideology key
 */
export function getIdeologyKeyFromShort(
  short: string | null | undefined,
  config: Automator.Configuration
): string | null {
  const ideology = Object.entries(config.ideologies).find(([_, value]) => value.short === short)
  if (ideology) return ideology[0]

  return null
}
