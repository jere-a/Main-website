export const detectTouchscreen = (): boolean => {
  // Most reliable modern signal
  if ((navigator.maxTouchPoints ?? 0) > 0) return true;

  // Pointer media query (coarse pointer usually implies touch)
  if (window.matchMedia?.("(any-pointer: coarse)").matches) return true;

  // Legacy fallback
  return "ontouchstart" in window;
};

const isMobileUA = (ua: string): boolean =>
  /mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua);

const isTabletUA = (ua: string): boolean =>
  /ipad|tablet|android(?!.*mobile)|silk|playbook/i.test(ua);

export const isMobile = (): boolean => {
  const ua = navigator.userAgent;

  // Prefer UA-CH when available (more robust than UA sniffing)
  // @ts-expect-error - userAgentData not available in typescript when writing this
  const mobile = navigator.userAgentData.mobile ?? isMobileUA(ua);
  const tablet = !mobile && isTabletUA(ua);

  return (mobile || tablet) && detectTouchscreen();
};
