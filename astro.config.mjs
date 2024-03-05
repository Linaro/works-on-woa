import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://www.worksonwoa.com",
  output: "static",
  integrations: [
    sitemap(),
    // pagefind(),
    tailwind({
      applyBaseStyles: false,
    }),
    solidJs(),
  ],
  cacheDir: "./cache",
  compressHTML: true,
  build: {
    rollupOptions: {
      external: ["/_pagefind/pagefind.js"],
    },
  },
});