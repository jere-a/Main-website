import { fromMediaQuery } from "@nanostores/media-query";
import { atom } from "nanostores";

declare global {
  interface Navigator {
    standalone: boolean;
  }
}

function isPWA(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOS = window.navigator.standalone;
  return isStandalone || isIOS;
}

export const isPrefersReducedMotion = fromMediaQuery("(prefers-reduced-motion: reduce)");

export const $isOnline = atom<boolean>(navigator.onLine);

const update = () => $isOnline.set(navigator.onLine);

window.addEventListener("online", update);
window.addEventListener("offline", update);

export const $isPWA = atom<boolean>(isPWA());

window.addEventListener("load", () => $isPWA.set(isPWA()));
window.addEventListener("popstate", () => $isPWA.set(isPWA()));
