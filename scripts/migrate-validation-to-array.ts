/**
 * One-time migration: convert each project's `validation` field from a single
 * string to an array of strings.
 *
 * Idempotent — entries already stored as arrays are normalized (deduped,
 * unknown values dropped) and left otherwise untouched.
 *
 * Run with: npx tsx scripts/migrate-validation-to-array.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS_PATH = path.join(__dirname, "../src/data/content/projects.json");

const VALID_VALUES = [
  "microsoft",
  "qualcomm",
  "nvidia",
  "developer",
  "community",
  "unverified",
] as const;

type Validation = (typeof VALID_VALUES)[number];

const VALID_SET = new Set<string>(VALID_VALUES);

/** Canonical ordering so output is deterministic regardless of input order. */
const ORDER = new Map<string, number>(VALID_VALUES.map((v, i) => [v, i]));

function normalize(raw: unknown, slug: string): Validation[] {
  const list = Array.isArray(raw) ? raw : raw == null ? [] : [raw];

  const seen = new Set<string>();
  for (const entry of list) {
    if (typeof entry !== "string") {
      throw new Error(`Project "${slug}": non-string validation entry ${JSON.stringify(entry)}`);
    }
    const value = entry.trim().toLowerCase();
    if (!VALID_SET.has(value)) {
      throw new Error(`Project "${slug}": unknown validation value "${entry}"`);
    }
    seen.add(value);
  }

  if (seen.size === 0) seen.add("unverified");
  // "unverified" is meaningless alongside a real validator.
  if (seen.size > 1) seen.delete("unverified");

  return [...seen].sort((a, b) => ORDER.get(a)! - ORDER.get(b)!) as Validation[];
}

function main() {
  const raw = readFileSync(PROJECTS_PATH, "utf8");
  const projects = JSON.parse(raw) as Record<string, unknown>[];

  let converted = 0;
  let alreadyArray = 0;

  for (const project of projects) {
    const slug = String(project.slug ?? "<unknown>");
    const before = project.validation;
    const after = normalize(before, slug);

    if (Array.isArray(before)) alreadyArray++;
    else converted++;

    project.validation = after;
  }

  writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 2) + "\n", "utf8");

  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const v of project.validation as string[]) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }

  console.log(`Projects processed: ${projects.length}`);
  console.log(`  converted from string: ${converted}`);
  console.log(`  already array:         ${alreadyArray}`);
  console.log("Validation value counts:");
  for (const value of VALID_VALUES) {
    console.log(`  ${value.padEnd(12)} ${counts.get(value) ?? 0}`);
  }
}

main();
