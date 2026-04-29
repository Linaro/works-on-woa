import type jsPDF from "jspdf";

/**
 * Per-locale CJK fonts from Google Fonts GitHub (full TTFs, not Unicode-range subsets).
 * Each covers all glyphs for its language + Latin (~4-5MB, fetched on demand and cached).
 */
const FONT_URLS: Record<string, string> = {
  ja: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf",
  ko: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf",
  zh: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf",
};

const CJK_LOCALES = ["ja", "ko", "zh"];

const cachedFonts = new Map<string, string>();

/**
 * Returns true if the given locale requires a CJK-capable font.
 */
export function isCjkLocale(locale: string): boolean {
  return CJK_LOCALES.some((code) => locale.startsWith(code));
}

/**
 * Resolves the locale prefix (e.g. "zh-CN" → "zh").
 */
function resolveLocaleKey(locale: string): string {
  return CJK_LOCALES.find((code) => locale.startsWith(code)) ?? "zh";
}

/**
 * Fetches the font for the given locale (once), converts to base64, and caches it.
 */
async function loadCjkFont(locale: string): Promise<string> {
  const key = resolveLocaleKey(locale);
  const cached = cachedFonts.get(key);
  if (cached) return cached;

  const url = FONT_URLS[key] as string;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch CJK font for ${key}: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    chunks.push(String.fromCharCode(bytes[i]!));
  }
  const base64 = btoa(chunks.join(""));
  cachedFonts.set(key, base64);
  return base64;
}

const FONT_NAME = "NotoSansCJK";

/**
 * Registers the CJK font with a jsPDF instance (if needed for the current locale)
 * and returns the font family name to use for `doc.setFont()`.
 *
 * For Latin-only locales, returns "helvetica" (built-in, no download).
 */
export async function ensurePdfFont(doc: jsPDF, locale: string): Promise<string> {
  if (!isCjkLocale(locale)) return "helvetica";

  const key = resolveLocaleKey(locale);
  const fileName = `NotoSans-${key}.ttf`;
  const base64 = await loadCjkFont(locale);
  doc.addFileToVFS(fileName, base64);
  doc.addFont(fileName, FONT_NAME, "normal");
  doc.addFont(fileName, FONT_NAME, "bold");
  return FONT_NAME;
}
