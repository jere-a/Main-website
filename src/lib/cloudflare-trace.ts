/** Cloudflare trace endpoint fetcher. Parses the /cdn-cgi/trace response into a validated object. */

import * as v from "valibot";

/** Schema for the key-value fields returned by Cloudflare's trace endpoint. */
const ParsedDataSchema = v.object({
  ip: v.string(),
  uag: v.string(),
  tls: v.string(),
  loc: v.string(),
  http: v.string(),
  h: v.string(),
});

export type ParsedData = v.InferInput<typeof ParsedDataSchema>;

/** Recognized keys from the trace endpoint response. */
const TRACE_KEYS = ["ip", "uag", "tls", "loc", "http", "h"] as const;
type TraceKey = (typeof TRACE_KEYS)[number];

/** Type guard: check if a string is a valid trace key. */
const isTraceKey = (key: string): key is TraceKey =>
  (TRACE_KEYS as readonly string[]).includes(key);

/** Fetch and parse Cloudflare trace data. Throws on invalid response. */
export async function fetchData(): Promise<ParsedData> {
  const res = await fetch(`${window.location.origin}/cdn-cgi/trace`);
  const text = await res.text();

  const raw: Partial<Record<TraceKey, string>> = {};

  for (const line of text.split(/\r?\n/)) {
    const eqIndex = line.indexOf("=");
    const key = eqIndex === -1 ? line : line.slice(0, eqIndex);
    const value = eqIndex === -1 ? "" : line.slice(eqIndex + 1);

    if (key && isTraceKey(key)) {
      raw[key] = value;
    }
  }

  return v.parse(ParsedDataSchema, raw);
}
