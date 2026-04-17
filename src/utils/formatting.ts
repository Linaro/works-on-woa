/**
 * Format a date string to locale-specific format
 */
export function formatDate(dateString: string, locale = "en-US"): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Slugify a string for URL use
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format a category slug for display (e.g. "dev-tools" → "Dev Tools")
 */
const CATEGORY_OVERRIDES: Record<string, string> = {
  "ai": "AI",
  "ai-tool": "AI Tool",
  "oss": "OSS",
  "cad": "CAD",
  "ecom": "Ecommerce",
  "data-prot": "Data Protection",
  "endpoint-sec": "Endpoint Security",
  "it": "IT",
  "nw-storage": "Network Storage",
  "it-tools-vdi": "IT Tools VDI",
  "it-sec-tools": "IT Security Tools",
  "nav": "Navigation",
  "personalfin": "Personal Finance",
  "sysinfo": "System Info",
  "vpn": "VPN",
  "utils-tools": "Utility",
  "prod": "Productivity",
  "actionandadventure": "Action & Adventure",
  "cardandboard": "Card & Board",
  "roleplaying": "Role Playing",
};

export function formatCategory(slug: string): string {
  return CATEGORY_OVERRIDES[slug] ?? slug.split("-").map(capitalize).join(" ");
}
