import { type } from "arktype";
import { siteConfig } from "@/config";

const ParsedDataSchema = type({
  ip: "string",
  uag: "string",
  tls: "string",
  loc: "string",
  http: "string",
  h: "string",
});

export type ParsedData = typeof ParsedDataSchema.infer;

const TRACE_KEYS = ["ip", "uag", "tls", "loc", "http", "h"] as const;
type TraceKey = (typeof TRACE_KEYS)[number];

export async function fetchData(): Promise<ParsedData> {
  const res = await fetch(`${siteConfig.url}/cdn-cgi/trace`);
  const text = await res.text();

  const raw: Partial<Record<TraceKey, string>> = {};

  for (const line of text.split("\n")) {
    const [key, value] = line.split("=");

    if (TRACE_KEYS.includes(key as TraceKey)) {
      raw[key as TraceKey] = value ?? "";
    }
  }

  const result = ParsedDataSchema(raw);

  if (result instanceof type.errors) {
    throw new Error(`Invalid trace data: ${result.summary}`);
  }

  return result;
}
