export default function getLanguageName(locale: string): string {
  switch (locale) {
    case 'en':
      return 'English'
    case 'el':
      return 'Ελληνικά'
    case 'it':
      return 'Italiano'
    case 'de':
      return 'Deutsch'
    default:
      return locale
  }
}
