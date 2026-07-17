/**
 * Reactive client-side stores using nanostores. Tracks online status, PWA mode, and reduced-motion
 * preference.
 */

import { fromMediaQuery } from "@nanostores/media-query";
import { atom } from "nanostores";

declare global {
  interface Navigator {
    standalone: boolean;
  }
}

/** Check if the app is running as a standalone PWA. */
function isPWA(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOS = window.navigator.standalone;
  return isStandalone || isIOS;
}

/** Reactive store: true when the user prefers reduced motion. */
export const isPrefersReducedMotion = fromMediaQuery("(prefers-reduced-motion: reduce)");

/** Reactive store: true when the browser is online. */
export const $isOnline = atom<boolean>(navigator.onLine);

const update = () => $isOnline.set(navigator.onLine);

window.addEventListener("online", update);
window.addEventListener("offline", update);

/** Reactive store: true when running as a PWA. */
export const $isPWA = atom<boolean>(isPWA());

window.addEventListener("load", () => $isPWA.set(isPWA()));
window.addEventListener("popstate", () => $isPWA.set(isPWA()));
