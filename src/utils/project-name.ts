import i18n from "i18next";
import type { Project } from "@/data/types";

// Hiragana, Katakana (incl. phonetic extensions), CJK ideographs, and half-width Katakana
const JAPANESE_CHAR_REGEX = /[\u3040-\u30ff\u31f0-\u31ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;

export function containsJapanese(text: string): boolean {
  return JAPANESE_CHAR_REGEX.test(text);
}

/** NFKC-normalizes (e.g. half-width → full-width Katakana) and lowercases for search matching. */
export function normalizeForSearch(text: string): string {
  return text.normalize("NFKC").toLowerCase();
}

/**
 * Returns the name to display for a project in the given language.
 * Uses `translatedTitleJP` when Japanese is selected and a translation exists.
 */
export function getProjectDisplayName(
  project: Pick<Project, "name" | "translatedTitleJP">,
  language: string = i18n.language
): string {
  if (language?.startsWith("ja") && project.translatedTitleJP) {
    return project.translatedTitleJP;
  }
  return project.name;
}
