import { defineConfig } from "astro/config";
import aws from "astro-sst";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";
import pagefind from "./integrations/pagefind";
import auth from "./integrations/auth";
import { loadEnv } from "vite";
import { LOCALES, DEFAULT_LOCALE } from "./src/config/i18nConfig";

const { IS_PUBLIC, PRE_BUILD, CUSTOM_DOMAIN } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  ""
);
const is_public = IS_PUBLIC === "true"
const is_pre_build = PRE_BUILD === "true"

// https://astro.build/config
export default defineConfig({
  ...(is_public
    ? {
        output: "static",
        adapter: aws(),
        integrations: [
          sitemap(),
          pagefind({
            is_pre_build: is_pre_build,
            is_public: is_public,
          }),
          tailwind({
            applyBaseStyles: false,
          }),
          solidJs(),
        ],
      }
    : {
        output: PRE_BUILD ? "hybrid" : "server",
        adapter: aws({
          serverRoutes: ["/api/*"],
        }),
        integrations: [
          sitemap(),
          pagefind({
            is_pre_build: is_pre_build,
            is_public: is_public,
          }),
          tailwind({
            applyBaseStyles: false,
          }),
          solidJs(),
          auth({
            injectEndpoints: true,
          }),
        ],
      }),
  site: `https://${CUSTOM_DOMAIN}`,
  cacheDir: "./cache",
  compressHTML: true,
  build: {
    rollupOptions: {
      external: ["/pagefind/pagefind.js"],
    },
  },
  vite: {
    build: {
      target: 'es2022',
    },
    optimizeDeps: { 
      exclude: ['auth:config'],
      esbuildOptions: {
        target: 'es2022'
      }
     },
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    }
  }
});
