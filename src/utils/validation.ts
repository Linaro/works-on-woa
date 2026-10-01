import type { Validation } from "@/data/types";

/** Canonical display order, mirroring scripts/migrate-validation-to-array.ts. */
export const VALIDATION_ORDER: Validation[] = [
  "microsoft",
  "qualcomm",
  "nvidia",
  "developer",
  "community",
  "unverified",
];

type TFn = (key: string, options?: Record<string, unknown>) => string;

export function orderValidations(validation: Validation[]): Validation[] {
  const index = (v: Validation) => {
    const i = VALIDATION_ORDER.indexOf(v);
    return i === -1 ? VALIDATION_ORDER.length : i;
  };
  return [...validation].sort((a, b) => index(a) - index(b));
}

/** Validators worth displaying, in canonical order. */
export function shownValidations(
  validation: Validation[] | Validation | undefined
): Validation[] {
  const list = Array.isArray(validation)
    ? validation
    : validation
      ? [validation]
      : [];
  return orderValidations(list).filter((v) => v !== "unverified");
}

/**
 * Renders one or more validators as label lines, e.g. ["Verified by Microsoft, Qualcomm"].
 * More than two validators are split across two lines to limit horizontal growth.
 * Returns an empty array when there is nothing verified.
 */
export function formatValidationLines(
  validation: Validation[] | Validation | undefined,
  t: TFn
): string[] {
  const shown = shownValidations(validation);

  if (shown.length === 0) return [];
  if (shown.length === 1 && shown[0] === "community") {
    return [t("validation.community")];
  }

  const names = shown.map((v) => t(`validation.names.${v}`));
  if (names.length <= 2) {
    return [t("validation.verifiedBy", { names: names.join(", ") })];
  }

  // Fewer names on the first line to offset the "Verified by" prefix.
  const split = Math.floor(names.length / 2);
  return [
    t("validation.verifiedBy", { names: names.slice(0, split).join(", ") }) + ",",
    names.slice(split).join(", "),
  ];
}

/**
 * Single-line form of {@link formatValidationLines}, for exports and plain text.
 * Returns an empty string when there is nothing verified.
 */
export function formatValidationList(
  validation: Validation[] | Validation | undefined,
  t: TFn
): string {
  return formatValidationLines(validation, t).join(" ");
}
