export default function getLanguageName(locale: string): string {
  switch (locale) {
    case 'en':
      return 'English'
    case 'el':
      return 'Ελληνικά'
    case 'fr':
      return 'Français'
    case 'ag':
      return 'Ἀρχαῖα Ἑλληνική'
    case 'es':
      return 'Espanol'
    case 'tl':
      return 'Tagalog'
    case 'it':
      return 'Italiano'
    case 'de':
      return 'Deutsch'
    case 'pirate':
      return 'Pirate English'
    case 'enderman':
      return 'egagnahdE egaugnaL'
    default:
      return locale
  }
}
