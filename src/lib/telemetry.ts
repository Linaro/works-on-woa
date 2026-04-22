import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import i18n from "i18next";

const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
const buildMode = import.meta.env.MODE; // "development" | "production"

function resolveEnvironment(): string {
  if (buildMode === "development") return "development";
  const host = window.location.hostname;
  if (host === "publish.worksonwoa.com") return "publish";
  if (host === "staging.worksonwoa.com") return "staging";
  if (host === "worksonwoa.com" || host === "www.worksonwoa.com") return "production";
  return host; // fallback for preview/unknown deployments
}

let appInsights: ApplicationInsights | null = null;

export function initTelemetry() {
  if (!connectionString) {
    console.warn("[Telemetry] Missing VITE_APPINSIGHTS_CONNECTION_STRING — telemetry disabled.");
    return;
  }

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: false, // we handle route tracking manually for SPA
      disableFetchTracking: true,
      disableAjaxTracking: true,
    },
  });

  appInsights.loadAppInsights();

  // Tag every telemetry item with environment, locale + ISO timestamp
  const environment = resolveEnvironment();
  appInsights.addTelemetryInitializer((envelope) => {
    envelope.data = envelope.data ?? {};
    envelope.data.environment = environment;
    envelope.data.locale = i18n.language ?? "unknown";
    envelope.data.timestamp = new Date().toISOString();
  });
}

export function trackPageView(name: string, uri: string, properties?: Record<string, string>) {
  appInsights?.trackPageView({ name, uri, properties });
}

export function trackSearch(term: string) {
  appInsights?.trackEvent({
    name: "Search",
    properties: { term },
  });
}

export function trackButtonClick(buttonName: string, context?: Record<string, string>) {
  appInsights?.trackEvent({
    name: "ButtonClick",
    properties: { buttonName, ...context },
  });
}

export function trackFilterUsage(page: string, filterKey: string, values: string[]) {
  appInsights?.trackEvent({
    name: "FilterUsage",
    properties: { page, filterKey, values: values.join(",") },
  });
}

const MAX_SLUGS_BYTES = 8000;
const reportedSlugSets = new Set<string>();

function slugSetFingerprint(slugs: string[]): string {
  return [...slugs].sort().join("\0");
}

export function trackReportAction(
  action: string,
  title: string,
  slugs: string[],
) {
  const fingerprint = slugSetFingerprint(slugs);
  if (reportedSlugSets.has(fingerprint)) return;
  reportedSlugSets.add(fingerprint);

  const slugsJson = JSON.stringify(slugs);
  const truncated = slugsJson.length > MAX_SLUGS_BYTES;
  const safeSlugs = truncated
    ? JSON.stringify(slugs.slice(0, Math.floor(slugs.length * (MAX_SLUGS_BYTES / slugsJson.length))))
    : slugsJson;

  appInsights?.trackEvent({
    name: "CustomReportAction",
    properties: {
      action,
      title,
      appCount: String(slugs.length),
      slugs: safeSlugs,
      ...(truncated ? { truncated: "true" } : {}),
    },
  });
}

export function trackSearchSubmit(term: string, resultCount: number, scope?: string) {
  appInsights?.trackEvent({
    name: "SearchSubmit",
    properties: { term, resultCount: String(resultCount), scope: scope ?? "all" },
  });
}

export function trackSearchNoResults(term: string, scope?: string) {
  appInsights?.trackEvent({
    name: "SearchNoResults",
    properties: { term, scope: scope ?? "all" },
  });
}

export function trackSearchResultSelect(
  term: string,
  selectedSlug: string,
  selectedName: string,
  resultIndex: number,
  selectionMethod: "click" | "keyboard",
) {
  appInsights?.trackEvent({
    name: "SearchResultSelect",
    properties: {
      term,
      selectedSlug,
      selectedName,
      resultIndex: String(resultIndex),
      selectionMethod,
    },
  });
}

export function trackSearchDropdownView(term: string, resultCount: number, scope?: string) {
  appInsights?.trackEvent({
    name: "SearchDropdownView",
    properties: { term, resultCount: String(resultCount), scope: scope ?? "all" },
  });
}

export function trackSearchAbandon(term: string, resultCount: number) {
  appInsights?.trackEvent({
    name: "SearchAbandon",
    properties: { term, resultCount: String(resultCount) },
  });
}
