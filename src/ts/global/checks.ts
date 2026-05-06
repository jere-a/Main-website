import { regex } from "arkregex";

export const detectTouchscreen = (): boolean => {
  // Most reliable modern signal
  if ((navigator.maxTouchPoints ?? 0) > 0) return true;

  // Pointer media query (coarse pointer usually implies touch)
  if (window.matchMedia?.("(any-pointer: coarse)").matches) return true;

  // Legacy fallback
  return "ontouchstart" in window;
};

const isMobileUA = regex("/mobi|iphone|ipod|android.*mobile|windows phone/i");
const isTabletUA = regex("/ipad|tablet|android(?!.*mobile)|silk|playbook/i");

export const isMobile = (): boolean => {
  const ua = navigator.userAgent;

  // Prefer UA-CH when available (more robust than UA sniffing)
  // @ts-expect-error - userAgentData not available in typescript when writing this
  const mobile = navigator.userAgentData.mobile ?? isMobileUA.exec(ua);
  const tablet = !mobile && isTabletUA.exec(ua);

  return (mobile || tablet) && detectTouchscreen();
};
