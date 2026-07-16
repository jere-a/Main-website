// oxlint-disable typescript/no-unsafe-type-assertion
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import type { WorkboxPlugin } from "workbox-core";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import * as navigationPreload from "workbox-navigation-preload";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { imageCache } from "workbox-recipes";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from "workbox-strategies";

import { catchErrorTyped } from "@/ts/global/globals";

const DAY = 24 * 60 * 60;

const createPlugins = (maxEntries: number, maxAgeDays?: number) =>
  [
    new ExpirationPlugin({
      maxEntries,
      maxAgeSeconds: maxAgeDays ? maxAgeDays * DAY : 30 * DAY,
    }),
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ] as unknown as WorkboxPlugin[];

precacheAndRoute(self.__WB_MANIFEST, {
  directoryIndex: "index.html",
  cleanURLs: true,
});

cleanupOutdatedCaches();
navigationPreload.enable();

const sharedPlugins = createPlugins(200);

/*
 * HTML navigation
 *
 * Network first:
 * - fresh content after deploys
 * - cached fallback when offline
 */
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "pages",
      networkTimeoutSeconds: 3,
      plugins: sharedPlugins,
    }),
  ),
);

/*
 * Static build assets
 *
 * Astro/Vite assets are hashed, so they are immutable.
 */
registerRoute(
  ({ request }) =>
    ["style", "script", "worker", "sharedworker", "serviceworker", "embed", "track"].includes(
      request.destination,
    ),
  new CacheFirst({
    cacheName: "assets",
    plugins: createPlugins(350),
  }),
);

imageCache({
  maxEntries: 120,
});

/*
 * CDN assets
 */
registerRoute(
  ({ url }) =>
    url.origin === "https://cdn.jsdelivr.net" || url.origin === "https://fastly.jsdelivr.net",
  new StaleWhileRevalidate({
    cacheName: "cdn-assets",
    plugins: createPlugins(50),
  }),
);

self.addEventListener("activate", () => {
  void catchErrorTyped(
    (async () => {
      clientsClaim();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        // oxlint-disable-next-line unicorn/require-post-message-target-origin
        client.postMessage({ type: "PWA_RELOAD" });
      }
    })(),
  );
});
