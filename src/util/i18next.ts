import i18n, { createInstance,  type TFunction } from 'i18next';
import Backend from 'i18next-fs-backend';
import HttpBackend from 'i18next-http-backend'; // For client-side
import LanguageDetector from 'i18next-browser-languagedetector'; // For client-side detection
import { DEFAULT_LOCALE, LOCALES } from '../config/i18nConfig';

// this is a build-time i18next instance
export async function getFixedT(locale: string): Promise<TFunction>  {
  const newInstance = createInstance();

  return newInstance.use(Backend).init({
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

// this initializes i18next for client-side usage
export async function initClientI18next(locale?: string): Promise<TFunction> {
  return i18n
    .use(HttpBackend) // Use http backend for loading translations in browser
    .use(LanguageDetector) // Detect user language
    .init({
      lng: locale, // Use provided locale if available, otherwise let detector work
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: LOCALES,
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // Path relative to public folder
      },
      detection: {
        // Order and from where user language should be detected
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['cookie', 'localStorage'], // Cache detected language in cookie and localStorage
      },
      // debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
      interpolation: {
        escapeValue: false, // React already safes from xss
      },
    });
}