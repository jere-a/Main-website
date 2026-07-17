/**
 * Backward-compatible re-export hub. Prefer importing from the focused modules directly: dom.ts,
 * async.ts, language.ts, url.ts, temporal.ts
 */
export { detectLanguage } from "./language.ts";
export { throttle, catchErrorTyped } from "./async.ts";
export { injectCSS, addCSSFromURL, on } from "./dom.ts";
export { getQueryParam } from "./url.ts";
export { getTemporal } from "./temporal.ts";
