import { useCallback, useEffect, useMemo, useState } from "react";

export interface BulkReportState {
  title: string;
  slugs: string[];
}

const STORAGE_KEY = "woa.bulk-report.v1";
const EVENT_NAME = "woa:bulk-report-updated";
export const DEFAULT_BULK_REPORT_TITLE = "App Compat Report";

function sanitizeState(state: Partial<BulkReportState> | null | undefined): BulkReportState {
  const title =
    typeof state?.title === "string" && state.title.trim().length > 0
      ? state.title.trim()
      : DEFAULT_BULK_REPORT_TITLE;

  const rawSlugs = Array.isArray(state?.slugs) ? state!.slugs : [];
  const slugs = Array.from(
    new Set(
      rawSlugs
        .filter((slug): slug is string => typeof slug === "string")
        .map((slug) => slug.trim())
        .filter((slug) => slug.length > 0)
    )
  );

  return { title, slugs };
}

function safeParse(raw: string | null): Partial<BulkReportState> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<BulkReportState>;
  } catch {
    return null;
  }
}

export function getBulkReportState(): BulkReportState {
  if (typeof window === "undefined") {
    return { title: DEFAULT_BULK_REPORT_TITLE, slugs: [] };
  }

  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return sanitizeState(parsed);
}

function emitBulkReportUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function setBulkReportState(nextState: Partial<BulkReportState>) {
  if (typeof window === "undefined") return;

  const current = getBulkReportState();
  const sanitized = sanitizeState({
    title: nextState.title ?? current.title,
    slugs: nextState.slugs ?? current.slugs,
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  emitBulkReportUpdate();
}

export function clearBulkReportState() {
  if (typeof window === "undefined") return;
  const cleared: BulkReportState = {
    title: DEFAULT_BULK_REPORT_TITLE,
    slugs: [],
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared));
  emitBulkReportUpdate();
}

export function addBulkReportSlugs(slugs: string[]) {
  const current = getBulkReportState();
  const merged = Array.from(new Set([...current.slugs, ...slugs]));
  setBulkReportState({ slugs: merged });
}

export function addBulkReportSlug(slug: string) {
  addBulkReportSlugs([slug]);
}

export function removeBulkReportSlug(slug: string) {
  const current = getBulkReportState();
  setBulkReportState({ slugs: current.slugs.filter((s) => s !== slug) });
}

export function setBulkReportTitle(title: string) {
  setBulkReportState({ title });
}

export function encodeBulkReportState(state: BulkReportState): string {
  const payload = JSON.stringify(sanitizeState(state));
  return btoa(encodeURIComponent(payload));
}

export function decodeBulkReportState(encoded: string): BulkReportState | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return sanitizeState(JSON.parse(decoded) as Partial<BulkReportState>);
  } catch {
    return null;
  }
}

export function useBulkReport() {
  const [state, setState] = useState<BulkReportState>(() => getBulkReportState());

  useEffect(() => {
    const sync = () => setState(getBulkReportState());

    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const actions = useMemo(
    () => ({
      setState: (next: Partial<BulkReportState>) => setBulkReportState(next),
      clear: () => clearBulkReportState(),
      addSlug: (slug: string) => addBulkReportSlug(slug),
      addSlugs: (slugs: string[]) => addBulkReportSlugs(slugs),
      removeSlug: (slug: string) => removeBulkReportSlug(slug),
      setTitle: (title: string) => setBulkReportTitle(title),
    }),
    []
  );

  const hasSlug = useCallback(
    (slug: string) => state.slugs.includes(slug),
    [state.slugs]
  );

  return {
    ...state,
    ...actions,
    hasSlug,
  };
}
