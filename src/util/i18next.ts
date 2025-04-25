import i18n, { createInstance,  type TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LOCALE, LOCALES } from '../config/i18nConfig';
import type { AstroGlobal } from 'astro';


export function getCurrentLocale(Astro?: AstroGlobal): string {
  const lang = Astro?.currentLocale || new LanguageDetector().detect(['path', 'querystring']) || DEFAULT_LOCALE;

  if (typeof lang === 'object') {
    return lang[0];
  }
  console.log('Detected language:', lang);
  return lang;
}

// this is a build-time i18next instance
export async function getFixedT(locale: string): Promise<TFunction>  {
  return createInstance().use(Backend).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES,
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
    }
  });
}
export async function initClientI18next(locale: string): Promise<TFunction> {
  return i18n
    .use(HttpBackend)
    .init({
      lng: locale, 
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: LOCALES,
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      }
    });
}