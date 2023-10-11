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
    pagefind(),
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
    format: "file",
  },
  vite: {
    plugins: [rawFonts([".ttf"])],
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  },
});

function rawFonts(ext) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
