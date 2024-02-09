const languageNames: { [key: string]: string } = {
  en: 'English',
  el: 'Ελληνικά',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français'
};

export default function getLanguageName(locale: string): string {
  const normalizedLocale = locale.toLowerCase();

  if (normalizedLocale in languageNames) {
    return languageNames[normalizedLocale];
  } else {
    return locale;
  }
}