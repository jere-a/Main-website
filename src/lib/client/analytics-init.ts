/**
 * Deferred analytics bootstrap. The heavy `posthog-js` bundle is loaded lazily by `@lib/analytics`,
 * so this module only decides _when_ to start it: once the browser is idle, never competing with
 * the first paint.
 */

import { init } from "@lib/analytics.ts";

const startAnalytics = (): void => {
  // oxlint-disable-next-line promise/prefer-await-to-then
  void init().catch((error: unknown) => {
    // oxlint-disable-next-line no-console
    console.error("posthog init failed", error);
  });
};

/** Schedule analytics initialisation without blocking the first paint. */
export const runAnalyticsInit = (): void => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(startAnalytics, { timeout: 3000 });
    return;
  }

  window.setTimeout(startAnalytics, 1000);
};
