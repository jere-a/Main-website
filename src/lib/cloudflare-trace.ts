/** Cloudflare trace endpoint fetcher. Parses the /cdn-cgi/trace response into a validated object. */

import * as v from "valibot";

const ParsedDataSchema = v.object({
  ip: v.pipe(v.string(), v.ip()),
  uag: v.pipe(v.string(), v.minLength(1)),
  tls: v.picklist(["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"]),
  loc: v.pipe(v.string(), v.regex(/^[A-Z]{2}$/)),
  http: v.picklist(["http/1.0", "http/1.1", "http/2", "http/3"]),
  h: v.pipe(
    v.string(),
    v.minLength(1),
    v.regex(
      /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
    ),
  ),
});

export type ParsedData = v.InferInput<typeof ParsedDataSchema>;

export async function fetchData(): Promise<ParsedData> {
  const text = await fetch(`${window.location.origin}/cdn-cgi/trace`).then((r) => r.text());

  const raw: Record<string, string> = {};

  for (const line of text.split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i !== -1) raw[line.slice(0, i)] = line.slice(i + 1);
  }

  return v.parse(ParsedDataSchema, raw);
}
