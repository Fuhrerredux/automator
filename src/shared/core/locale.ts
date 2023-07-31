export default function getLanguageName(locale: string): string {
  switch (locale) {
    case 'en':
      return 'English'
    case 'el':
      return 'Greek'
    default:
      return locale
  }
}
