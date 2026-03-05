import { fromMediaQuery } from "@nanostores/media-query";

export const isPrefersReducedMotion = fromMediaQuery(
  "(prefers-reduced-motion: reduce)",
);
