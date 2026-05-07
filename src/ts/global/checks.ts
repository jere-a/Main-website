export const deviceCapabilities = () => {
  const hasTouch =
    (navigator.maxTouchPoints ?? 0) > 0 ||
    window.matchMedia?.("(any-pointer: coarse)").matches ||
    "ontouchstart" in window;
  const hasHover = window.matchMedia?.("(any-hover: hover)").matches ?? false;
  const hasFinePointer =
    window.matchMedia?.("(any-pointer: fine)").matches ?? false;
  const isSmallViewport =
    window.matchMedia?.("(max-width: 768px)").matches ?? false;

  return {
    hasTouch,
    hasHover,
    hasFinePointer,
    isSmallViewport,
    prefersMobileUI: hasTouch && isSmallViewport,
    prefersTouchUI: hasTouch && !hasHover,
    prefersDesktopUI: hasHover && hasFinePointer,
  };
};

export const isMobile = (): boolean => {
  const caps = deviceCapabilities();
  return caps.prefersMobileUI || caps.prefersTouchUI;
};
