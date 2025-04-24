import { DEFAULT_LOCALE, LOCALES } from "./src/config/i18nConfig.js";

export default {
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  load: ["server", "client"],
  resourcesBasePath: "/locales",
  showDefaultLocale: true,
  i18nextServer: {
    debug: true,
  }
};
