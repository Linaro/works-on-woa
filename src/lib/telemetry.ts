import { ApplicationInsights } from "@microsoft/applicationinsights-web";

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

  // Tag every telemetry item with environment + ISO timestamp
  const environment = resolveEnvironment();
  appInsights.addTelemetryInitializer((envelope) => {
    envelope.data = envelope.data ?? {};
    envelope.data.environment = environment;
    envelope.data.timestamp = new Date().toISOString();
  });
}

export function trackPageView(name: string, uri: string) {
  appInsights?.trackPageView({ name, uri });
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
