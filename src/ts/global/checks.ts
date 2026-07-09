const mqm = (q: string) => window.matchMedia?.(q);

export const deviceCapabilities = () => {
  const hasTouch =
    navigator.maxTouchPoints > 0 ||
    mqm("(any-pointer: coarse)")?.matches ||
    "ontouchstart" in window;
  const hasHover = mqm("(any-hover: hover)")?.matches ?? false;
  const hasFinePointer = mqm("(any-pointer: fine)")?.matches ?? false;
  const isSmallViewport = mqm("(max-width: 768px)")?.matches ?? false;

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
