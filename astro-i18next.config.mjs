import { DEFAULT_LOCALE, LOCALES } from "./src/config/i18nConfig.js";
import en from "./public/locales/en/translation.json" assert { type: 'json' };
import ja from "./public/locales/ja/translation.json" assert { type: 'json' };
import ko from "./public/locales/ko/translation.json" assert { type: 'json' };
import zh from "./public/locales/zh/translation.json" assert { type: 'json' };

export default {
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  load: ["server", "client"],
  resourcesBasePath: "/locales",
  showDefaultLocale: true,
  i18nextServer: {
    debug: true,
    resources: {
      en: { translation: { ...en } },
      ja: { translation: { ...ja } },
      ko: { translation: { ...ko } },
      zh: { translation: { ...zh } },
    },
    ns: ['translation'],
    defaultNS: 'translation'
  },
};
