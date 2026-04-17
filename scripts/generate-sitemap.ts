/**
 * Generates sitemap.xml from projects.json after the Vite build.
 *
 * Usage: tsx scripts/generate-sitemap.ts
 * Reads: src/data/content/projects.json
 * Writes: dist/sitemap.xml
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://worksonwoa.com";

interface ProjectEntry {
  slug: string;
  type: "application" | "game";
  publisher: string;
  lastUpdated: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function run() {
  const projectsPath = path.resolve(__dirname, "../src/data/content/projects.json");
  const outputPath = path.resolve(__dirname, "../dist/sitemap.xml");

  if (!fs.existsSync(path.resolve(__dirname, "../dist"))) {
    console.error("dist/ not found — run 'npm run build' first.");
    process.exit(1);
  }

  const projects: ProjectEntry[] = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));

  // Static pages
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/apps", priority: "0.9", changefreq: "weekly" },
    { loc: "/games", priority: "0.9", changefreq: "weekly" },
    { loc: "/publishers", priority: "0.8", changefreq: "weekly" },
    { loc: "/faq", priority: "0.5", changefreq: "monthly" },
    { loc: "/learn", priority: "0.6", changefreq: "monthly" },
    { loc: "/learn/getting-started", priority: "0.6", changefreq: "monthly" },
    { loc: "/learn/prism", priority: "0.6", changefreq: "monthly" },
    { loc: "/learn/windows-on-arm", priority: "0.6", changefreq: "monthly" },
  ];

  // Dynamic pages from projects
  const publisherSlugs = new Set<string>();

  const projectEntries = projects.map((p) => {
    const basePath = p.type === "application" ? "/apps" : "/games";
    if (p.publisher) {
      publisherSlugs.add(slugify(p.publisher));
    }
    return {
      loc: `${basePath}/${p.slug}`,
      priority: "0.4",
      changefreq: "monthly",
      lastmod: p.lastUpdated,
    };
  });

  const publisherEntries = Array.from(publisherSlugs).map((slug) => ({
    loc: `/publishers/${slug}`,
    priority: "0.6",
    changefreq: "monthly",
  }));

  const allEntries = [
    ...staticPages,
    ...projectEntries,
    ...publisherEntries,
  ];

  const urls = allEntries
    .map((entry) => {
      const lastmod = "lastmod" in entry && entry.lastmod
        ? `\n    <lastmod>${entry.lastmod}</lastmod>`
        : "";
      return `  <url>
    <loc>${SITE_URL}${entry.loc}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.writeFileSync(outputPath, sitemap, "utf-8");
  console.log(`Sitemap generated: ${allEntries.length} URLs → dist/sitemap.xml`);
}

run();
