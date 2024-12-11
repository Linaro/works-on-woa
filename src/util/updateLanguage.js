import i18next from 'i18next';
import { DEFAULT_LOCALE, LOCALES } from '../config/i18nConfig';

export function updateLanguage(url) {
  const urlFirstSegment = url.pathname.split('/').filter(Boolean)[0];
  let locale = DEFAULT_LOCALE;

  if (LOCALES.includes(urlFirstSegment)) {
    locale = urlFirstSegment;
  }

  if (locale !== i18next.language) {
    i18next.changeLanguage(locale);
  }

  return i18next.language;
}
