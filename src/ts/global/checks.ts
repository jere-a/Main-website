import bowser from "bowser";
import { isPrefersReducedMotion } from "@/ts/stores";

export function detectTouchscreen(): boolean {
  let result = false;
  if (window.PointerEvent && "maxTouchPoints" in navigator) {
    // if Pointer Events are supported, just check maxTouchPoints
    if (navigator.maxTouchPoints > 0) {
      result = true;
    }
  } else if (window.matchMedia?.("(any-pointer:coarse)").matches) {
    // no Pointer Events...
    // check for any-pointer:coarse which mostly means touchscreen
    result = true;
  } else if (window.TouchEvent || "ontouchstart" in window) {
    // last resort - check for exposed touch events API / event handler
    result = true;
  }
  return result;
}

export const isMobile = (): boolean => {
  const browser = bowser.parse(window.navigator.userAgent);

  if (
    typeof browser.platform.type === "string" &&
    browser.platform.type !== "desktop" &&
    detectTouchscreen()
  ) {
    return true;
  } else {
    return false;
  }
};

export const PrefersReducedMotion = () => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handleReducedMotionChange = (
    event: MediaQueryListEvent | MediaQueryList,
  ) => {
    const prefersReducedMotion = event.matches === true;
    console.log("Prefers Reduced Motion:", prefersReducedMotion);
    isPrefersReducedMotion.set(prefersReducedMotion);
  };

  handleReducedMotionChange(mediaQuery);

  // Add listener for changes
  mediaQuery.addEventListener("change", handleReducedMotionChange);
};
