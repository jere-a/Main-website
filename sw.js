// public/sw.js
import { clientsClaim } from 'workbox-core';
import * as navigationPreload from 'workbox-navigation-preload';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute, Route } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Precache the manifest
precacheAndRoute(self.__WB_MANIFEST, { directoryIndex: 'index.html', cleanURLs: true });

// Clean up outdated caches
cleanupOutdatedCaches();

// Enable navigation preload
navigationPreload.enable();

// Create a new navigation route that uses the Network-first, falling back to
// cache strategy for navigation requests with its own cache. This route will be
// handled by navigation preload. The NetworkOnly strategy will work as well.
const navigationRoute = new NavigationRoute(
	new NetworkFirst({
		cacheName: 'navigations',
		networkTimeoutSeconds: 3,
	})
);

// Register the navigation route
registerRoute(navigationRoute);

registerRoute(new NavigationRoute(createHandlerBoundToURL('/404')))


registerRoute(
	({ request }) => {
		return ['style', 'script', 'document', 'worker', 'embed', 'track', 'serviceworker', 'sharedworker'].includes(request.destination);
	},
	new NetworkFirst({
		cacheName: 'assets',
		networkTimeoutSeconds: 3,
	})
);

// Create a route for image, script, or style requests that use a
// stale-while-revalidate strategy. This route will be unaffected
// by navigation preload.
registerRoute(
	({ request }) => {
		return ['image', 'audio', 'font'].includes(request.destination);
	},
	new StaleWhileRevalidate({
		cacheName: 'static-assets',
	})
);

// Ensure the new service worker takes control immediately
self.skipWaiting();
clientsClaim();