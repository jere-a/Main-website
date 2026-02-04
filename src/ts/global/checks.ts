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

function getPlatformType(): "mobile" | "tablet" | "desktop" {
  // Prefer modern Client Hints if available
  const uaData = (navigator as any).userAgentData;
  if (uaData?.mobile === true) {
    return "mobile";
  }

  const ua = navigator.userAgent.toLowerCase();

  if (/ipad|tablet|(android(?!.*mobile))|silk|playbook/i.test(ua)) {
    return "tablet";
  }

  if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua)) {
    return "mobile";
  }

  return "desktop";
}

export const isMobile = (): boolean => {
  const platformType = getPlatformType();

  return (
    typeof platformType === "string" &&
    platformType !== "desktop" &&
    detectTouchscreen()
  );
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
