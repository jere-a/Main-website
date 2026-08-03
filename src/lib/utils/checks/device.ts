/**
 * Device capability detection. Checks touch support, hover capability, pointer precision, and
 * viewport size to determine the user's likely device type.
 */

/** Shorthand for window.matchMedia. */
const mqm = (q: string) => window.matchMedia(q);

/** Detect device capabilities from media queries and API checks. */
export const deviceCapabilities = () => {
  const hasTouch =
    navigator.maxTouchPoints > 0 ||
    mqm("(any-pointer: coarse)").matches ||
    "ontouchstart" in window;
  const hasHover = mqm("(any-hover: hover)").matches;
  const hasFinePointer = mqm("(any-pointer: fine)").matches;
  const isSmallViewport = mqm("(max-width: 768px)").matches;

  return {
    hasTouch,
    hasHover,
    hasFinePointer,
    isSmallViewport,
    /** Touch device with a small viewport. */
    prefersMobileUI: hasTouch && isSmallViewport,
    /** Touch device without hover (e.g. phone). */
    prefersTouchUI: hasTouch && !hasHover,
    /** Desktop with mouse and fine pointer. */
    prefersDesktopUI: hasHover && hasFinePointer,
  };
};

/** Quick check: is the user likely on a mobile device? */
export const isMobile = (): boolean => {
  const caps = deviceCapabilities();
  return caps.prefersMobileUI || caps.prefersTouchUI;
};
