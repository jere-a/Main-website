/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim, skipWaiting } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import * as navigationPreload from "workbox-navigation-preload";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST || [], {
  directoryIndex: "index.html",
  cleanURLs: true,
});

cleanupOutdatedCaches();
navigationPreload.enable();

const sharedPlugins = [
  new ExpirationPlugin({
    maxEntries: 200,
    maxAgeSeconds: 30 * 24 * 60 * 60,
  }),
  new CacheableResponsePlugin({
    statuses: [0, 200],
  }),
];

registerRoute(
  new NavigationRoute(
    new StaleWhileRevalidate({
      cacheName: "navigations",
      plugins: sharedPlugins,
    }),
  ),
);
registerRoute(new NavigationRoute(createHandlerBoundToURL("/404")));

registerRoute(
  ({ request }): boolean => {
    return [
      "style",
      "script",
      "document",
      "worker",
      "embed",
      "track",
      "serviceworker",
      "sharedworker",
    ].includes(request.destination);
  },
  new StaleWhileRevalidate({
    cacheName: "assets",
    plugins: sharedPlugins,
  }),
);

registerRoute(
  ({ request }): boolean => {
    return ["image", "audio", "font"].includes(request.destination);
  },
  new StaleWhileRevalidate({
    cacheName: "static-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 350,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }): boolean => {
    return (
      url.origin.includes("jsdelivr") || url.origin.includes("cdn.jsdelivr")
    );
  },
  new StaleWhileRevalidate({
    cacheName: "cdn-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

self.addEventListener("activate", async () => {
  clientsClaim();
  const clients = await self.clients.matchAll({ type: "window" });
  for (const client of clients) {
    client.postMessage({ type: "PWA_RELOAD" });
  }
});

skipWaiting();
