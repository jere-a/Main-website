/**
 * 404 page client-side logic. Displays the attempted URL in the error message and optionally
 * fetches Cloudflare trace data to show the visitor's IP.
 */

import posthog from "posthog-js";

import { siteFeatures } from "@/configFeatures";
import { fetchData } from "@/lib/cloudflare-trace";
import { catchErrorTyped } from "@/lib/utils/async.ts";

/** Paths that should show the default "this page is for debugging" message. */
const DEBUG_PATHS = ["404", "404.html", "404.htm", "404/index.html", "404/index.htm"];

const { pathname, search } = window.location;
const notFoundEl = document.querySelector<HTMLParagraphElement>(".NotFound");
const infoEl = document.querySelector<HTMLParagraphElement>(".info");

if (!DEBUG_PATHS.includes(pathname) && notFoundEl) {
  notFoundEl.innerText = `Sivuun ${pathname}${search} ei saatu yhteyttä.`;
} else if (notFoundEl) {
  notFoundEl.innerText = `Sivu jota yrität käyttää on tarkoitettu näytettäväksi jos etsimääsi sivua ei löydy.`;
}

posthog.onFeatureFlags(() => {
  void (async () => {
    if (posthog.isFeatureEnabled("fetchipp") || siteFeatures.params.functions.fetchIPP) {
      const [, data] = await catchErrorTyped(fetchData());
      if (data && infoEl) {
        infoEl.innerText = `Yhteyttä yrittänyt ip osoite: ${data.ip}\nUserAgent: ${data.uag}`;
      }
    }
  })();
});
