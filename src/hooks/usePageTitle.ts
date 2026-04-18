import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/telemetry";

const BASE_TITLE = "Windows on Arm";

/**
 * Sets document.title and tracks a page view once the title is available.
 * Pass a string to track immediately. Pass undefined to defer tracking
 * until the value resolves (e.g. after an async data fetch).
 * Optional properties are attached as custom dimensions on the page view.
 */
export function usePageTitle(title: string | undefined, properties?: Record<string, string>) {
  const location = useLocation();
  const lastTrackedRef = useRef("");

  useEffect(() => {
    // While title is undefined (data still loading), keep the base title
    // but don't fire a page-view event yet.
    if (title === undefined) return;

    const fullTitle = title === BASE_TITLE ? BASE_TITLE : `${title} | ${BASE_TITLE}`;
    document.title = fullTitle;

    const key = `${fullTitle}::${location.pathname}${location.search}`;
    if (key !== lastTrackedRef.current) {
      trackPageView(fullTitle, location.pathname + location.search, properties);
      lastTrackedRef.current = key;
    }

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, properties, location.pathname, location.search]);
}
