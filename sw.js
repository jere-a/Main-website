// public/sw.js
import * as navigationPreload from 'workbox-navigation-preload';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute, NavigationRoute, Route } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';

// Precache the manifest
precacheAndRoute(self.__WB_MANIFEST, { directoryIndex: 'index.html', cleanURLs: true });

// Enable navigation preload
navigationPreload.enable();

// Create a new navigation route that uses the Network-first, falling back to
// cache strategy for navigation requests with its own cache. This route will be
// handled by navigation preload. The NetworkOnly strategy will work as well.
const navigationRoute = new NavigationRoute(
	new NetworkFirst({
		cacheName: 'navigations',
	})
);

// Register the navigation route
registerRoute(navigationRoute);

const networkFirst = new Route(
	({ request }) => {
		return ['style', 'script', 'document', 'worker', 'embed', 'track', 'serviceworker', 'sharedworker'].includes(request.destination);
	},
	new NetworkFirst({
		cacheName: 'assets',
	})
);

registerRoute(networkFirst);

// Create a route for image, script, or style requests that use a
// stale-while-revalidate strategy. This route will be unaffected
// by navigation preload.
const staticAssetsRoute = new Route(
	({ request }) => {
		return ['image', 'audio', 'font'].includes(request.destination);
	},
	new StaleWhileRevalidate({
		cacheName: 'static-assets',
	})
);

// Register the route handling static assets
registerRoute(staticAssetsRoute);