/**
 * Migration script: Converts existing Markdown content files to a single projects.json
 *
 * Usage: npm run migrate
 *
 * Reads from /tmp/woa-content-backup/ (backed-up Markdown files)
 * Writes to src/data/content/projects.json
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

interface RawAppFrontmatter {
  name: string;
  icon?: string;
  categories?: string[];
  link?: string;
  version_from?: string;
  compatibility?: string;
  display_result?: string;
  featured?: boolean;
}

interface RawGameFrontmatter {
  name: string;
  icon?: string;
  categories?: string[];
  publisher?: string;
  compatibility?: string;
  compatibility_details?: string;
  link?: string;
  date_tested?: string;
}

interface ProjectOutput {
  slug: string;
  name: string;
  type: "application" | "game";
  icon: string;
  categories: string[];
  publisher: string;
  compatibility: "yes" | "no" | "unknown";
  emulationType: "native" | "emulation" | "unknown" | "na";
  compatibilityDetails?: string;
  versionFrom?: string;
  link?: string;
  validation: "microsoft" | "qualcomm" | "developer" | "community" | "unverified";
  lastUpdated: string;
  isMicrosoftApp?: boolean;
  microsoftCategory?: string;
}

const MICROSOFT_APPS = new Set([
  "microsoft-word",
  "microsoft-excel",
  "microsoft-powerpoint",
  "microsoft-outlook",
  "microsoft-onenote",
  "microsoft-teams",
  "microsoft-edge",
  "visual-studio-code",
  "visual-studio",
  "windows-terminal",
  "microsoft-365",
  "onedrive",
  "microsoft-to-do",
  "microsoft-whiteboard",
  "paint",
  "notepad",
  "calculator",
  "clipchamp",
  "microsoft-defender",
  "intune-company-portal",
]);

const MICROSOFT_CATEGORIES: Record<string, string> = {
  "microsoft-word": "productivity",
  "microsoft-excel": "productivity",
  "microsoft-powerpoint": "productivity",
  "microsoft-outlook": "communication",
  "microsoft-onenote": "productivity",
  "microsoft-teams": "communication",
  "microsoft-edge": "exploration",
  "visual-studio-code": "creativity",
  "visual-studio": "creativity",
  "windows-terminal": "creativity",
  "microsoft-365": "productivity",
  "onedrive": "productivity",
  "microsoft-to-do": "productivity",
  "microsoft-whiteboard": "creativity",
  "paint": "creativity",
  "notepad": "creativity",
  "calculator": "productivity",
  "clipchamp": "creativity",
  "microsoft-defender": "it-management",
  "intune-company-portal": "it-management",
};

function slugify(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapAppCompatibility(
  compat?: string,
  displayResult?: string
): { compatibility: "yes" | "no" | "unknown"; emulationType: "native" | "emulation" | "unknown" | "na" } {
  const c = compat?.toLowerCase() ?? "unknown";
  const d = displayResult?.toLowerCase() ?? "compatible";

  if (d === "unsupported" || c === "no") {
    return { compatibility: "no", emulationType: "na" };
  }

  if (c === "native") {
    return { compatibility: "yes", emulationType: "native" };
  }

  if (c === "emulation") {
    return { compatibility: "yes", emulationType: "emulation" };
  }

  return { compatibility: "unknown", emulationType: "unknown" };
}

function mapGameCompatibility(
  compat?: string
): { compatibility: "yes" | "no" | "unknown"; emulationType: "native" | "emulation" | "unknown" | "na" } {
  const c = compat?.toLowerCase() ?? "unknown";

  if (c === "perfect" || c === "playable" || c === "runs") {
    return { compatibility: "yes", emulationType: "emulation" };
  }

  if (c === "unplayable") {
    return { compatibility: "no", emulationType: "na" };
  }

  return { compatibility: "unknown", emulationType: "unknown" };
}

function processDirectory(
  dirPath: string,
  type: "application" | "game"
): ProjectOutput[] {
  const results: ProjectOutput[] = [];

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return results;
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
      const { data } = matter(content);
      const slug = slugify(file);

      if (type === "application") {
        const fm = data as RawAppFrontmatter;
        const { compatibility, emulationType } = mapAppCompatibility(
          fm.compatibility,
          fm.display_result
        );

        const cats = Array.isArray(fm.categories)
          ? fm.categories.map((c) => (typeof c === "string" ? c : String(c)))
          : [];

        const project: ProjectOutput = {
          slug,
          name: fm.name || file.replace(/\.md$/, ""),
          type: "application",
          icon: fm.icon || "application-icon-white.svg",
          categories: cats,
          publisher: "",
          compatibility,
          emulationType,
          versionFrom: fm.version_from,
          link: fm.link,
          validation: "community",
          lastUpdated: new Date().toISOString().split("T")[0]!,
        };

        if (MICROSOFT_APPS.has(slug)) {
          project.isMicrosoftApp = true;
          project.microsoftCategory = MICROSOFT_CATEGORIES[slug] || "productivity";
          project.validation = "microsoft";
          project.publisher = "Microsoft";
        }

        results.push(project);
      } else {
        const fm = data as RawGameFrontmatter;
        const { compatibility, emulationType } = mapGameCompatibility(
          fm.compatibility
        );

        const cats = Array.isArray(fm.categories)
          ? fm.categories.map((c) => (typeof c === "string" ? c : String(c)))
          : [];

        results.push({
          slug,
          name: fm.name || file.replace(/\.md$/, ""),
          type: "game",
          icon: fm.icon || "gaming-icon-white.svg",
          categories: cats,
          publisher: fm.publisher || "",
          compatibility,
          emulationType,
          compatibilityDetails: fm.compatibility_details,
          link: fm.link,
          validation: fm.publisher ? "developer" : "community",
          lastUpdated: fm.date_tested
            ? new Date(fm.date_tested).toISOString().split("T")[0]!
            : new Date().toISOString().split("T")[0]!,
        });
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  return results;
}

function main() {
  const backupDir = "/tmp/woa-content-backup";
  const outputPath = path.resolve("src/data/content/projects.json");

  console.log("Migrating content from:", backupDir);

  const apps = processDirectory(
    path.join(backupDir, "applications"),
    "application"
  );
  console.log(`Processed ${apps.length} applications`);

  const games = processDirectory(path.join(backupDir, "games"), "game");
  console.log(`Processed ${games.length} games`);

  const allProjects = [...apps, ...games].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allProjects, null, 2));

  console.log(
    `\nMigration complete! Written ${allProjects.length} projects to ${outputPath}`
  );
}

main();
