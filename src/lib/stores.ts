/**
 * Reactive client-side stores using nanostores. Tracks online status, PWA mode, and user
 * accessibility preferences.
 */

import { fromMediaQuery } from "@nanostores/media-query";
import { atom } from "nanostores";

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

/** Check whether the app is running as an installed PWA. */
function getIsPWA(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}

export const $prefersReducedMotion = fromMediaQuery("(prefers-reduced-motion: reduce)");

export const $isOnline = atom(navigator.onLine);

function updateOnlineStatus(): void {
  $isOnline.set(navigator.onLine);
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

export const $isPWA = atom(getIsPWA());

const standaloneQuery = window.matchMedia("(display-mode: standalone)");

standaloneQuery.addEventListener("change", () => {
  $isPWA.set(getIsPWA());
});
