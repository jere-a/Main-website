/** URL and query string utilities for client-side code. */

/** Get a query parameter value from the current page URL. */
export function getQueryParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}
