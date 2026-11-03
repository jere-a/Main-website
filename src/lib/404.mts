/**
 * 404 page client-side logic. Displays the attempted URL in the error message and optionally
 * fetches Cloudflare trace data to show the visitor's IP.
 */

import posthog from "@lib/analytics";

import { fetchData } from "@/lib/cloudflare-trace";
import { catchErrorTyped } from "@/lib/utils/async.ts";

/** Paths that should show the default "this page is for debugging" message. */
const DEBUG_PATHS = ["404", "404.html", "404.htm", "404/index.html", "404/index.htm"];

const { pathname, search } = window.location;
const notFoundEl = document.querySelector<HTMLParagraphElement>(".NotFound");
const infoEl = document.querySelector<HTMLParagraphElement>(".info");

if (notFoundEl) {
  notFoundEl.innerText = DEBUG_PATHS.includes(pathname)
    ? "Sivu jota yrität käyttää on tarkoitettu näytettäväksi jos etsimääsi sivua ei löydy."
    : `Sivuun ${pathname}${search} ei saatu yhteyttä.`;
}

/** Best-effort: reveal the visitor's IP when the `fetchipp` feature flag is enabled. */
async function showVisitorInfo(): Promise<void> {
  if (!posthog.isFeatureEnabled("fetchipp") || !infoEl) {
    return;
  }

  const [error, data] = await catchErrorTyped(fetchData(), [Error]);

  if (error) {
    console.error("Failed to load Cloudflare trace:", error);
    return;
  }

  infoEl.innerText = `Yhteyttä yrittänyt ip osoite: ${data.ip}\nUserAgent: ${data.uag}`;
}

posthog.onFeatureFlags(() => {
  void showVisitorInfo();
});
