import { fromMediaQuery } from "@nanostores/media-query";
import { atom } from "nanostores";

function isPWA(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOS = (window.navigator as any).standalone === true;
  return isStandalone || isIOS;
}

export const isPrefersReducedMotion = fromMediaQuery("(prefers-reduced-motion: reduce)");

export const $isOnline = atom<boolean>(navigator.onLine ?? true);

const update = () => $isOnline.set(navigator.onLine);

window?.addEventListener("online", update);
window?.addEventListener("offline", update);

export const $isPWA = atom<boolean>(isPWA());

window?.addEventListener("load", () => $isPWA.set(isPWA()));
window?.addEventListener("popstate", () => $isPWA.set(isPWA()));
