/** Cloudflare trace endpoint fetcher. Parses the /cdn-cgi/trace response into a validated object. */

import { type } from "arktype";

/** Schema for the key-value fields returned by Cloudflare's trace endpoint. */
const ParsedDataSchema = type({
  ip: "string",
  uag: "string",
  tls: "string",
  loc: "string",
  http: "string",
  h: "string",
});

export type ParsedData = typeof ParsedDataSchema.infer;

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

  for (const line of text.split("\n")) {
    const [key, value] = line.split("=");

    if (key && isTraceKey(key)) {
      raw[key] = value ?? "";
    }
  }

  const result = ParsedDataSchema(raw);

  if (result instanceof type.errors) {
    throw new Error(`Invalid trace data: ${result.summary}`);
  }

  return result;
}
