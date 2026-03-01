import { isPrefersReducedMotion } from "@/ts/stores";

export const detectTouchscreen = (): boolean => {
  if (window.PointerEvent && "maxTouchPoints" in navigator) {
    return navigator.maxTouchPoints > 0;
  }
  if (window.matchMedia?.("(any-pointer:coarse)").matches) return true;
  return window.TouchEvent !== undefined || "ontouchstart" in window;
};

type PlatformType = "mobile" | "tablet" | "desktop";

const getPlatformType = (): PlatformType => {
  const ua = navigator.userAgent.toLowerCase();

  if (/ipad|tablet|(android(?!.*mobile))|silk|playbook/i.test(ua))
    return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua))
    return "mobile";
  return "desktop";
};

export const isMobile = (): boolean => {
  const platform = getPlatformType();
  return platform !== "desktop" && detectTouchscreen();
};

export const PrefersReducedMotion = (): void => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handleChange = (event: MediaQueryListEvent | MediaQueryList): void => {
    isPrefersReducedMotion.set(event.matches);
  };

  handleChange(mediaQuery);
  mediaQuery.addEventListener("change", handleChange);
};
