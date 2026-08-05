/**
 * Temporal API polyfill loader. Returns the native Temporal if available, otherwise loads the
 * polyfill.
 */

import type { Temporal as TemporalType } from "@js-temporal/polyfill";

export async function getTemporal(): Promise<typeof TemporalType | typeof globalThis.Temporal> {
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (globalThis.Temporal) {
    return globalThis.Temporal;
  }

  return (await import("@js-temporal/polyfill")).Temporal;
}
