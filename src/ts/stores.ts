import { fromMediaQuery } from "@nanostores/media-query";
import { atom } from "nanostores";
import { isPWA } from "./global";

export const isPrefersReducedMotion = fromMediaQuery(
  "(prefers-reduced-motion: reduce)",
);

export const $isOnline = atom<boolean>(
  typeof navigator !== "undefined" ? navigator.onLine : true,
);

if (typeof window !== "undefined") {
  const update = () => $isOnline.set(navigator.onLine);

  window.addEventListener("online", update);
  window.addEventListener("offline", update);
}

export const $isPWA = atom<boolean>(isPWA());

window.addEventListener("load", () => $isPWA.set(isPWA()));
window.addEventListener("popstate", () => $isPWA.set(isPWA()));
