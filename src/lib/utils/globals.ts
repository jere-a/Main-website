/**
 * Re-export hub for client-side utilities. Prefer importing from the focused modules directly:
 * dom.ts, async.ts, language.ts, url.ts
 */
export { detectLanguage } from "./language.ts";
export { catchErrorTyped } from "./async.ts";
export { on } from "./dom.ts";
export { getQueryParam } from "./url.ts";
