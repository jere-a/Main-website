/** Cloudflare trace endpoint fetcher. Parses the /cdn-cgi/trace response into a validated object. */

import * as v from "valibot";

const ParsedDataSchema = v.object({
  ip: v.pipe(v.string(), v.ip()),
  uag: v.pipe(v.string(), v.minLength(1)),
  tls: v.picklist(["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3", "off"]),
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

  const raw = Object.fromEntries(
    text
      .split(/\r?\n/)
      .filter((line) => line.includes("="))
      .map((line) => {
        const i = line.indexOf("=");
        return [line.slice(0, i), line.slice(i + 1)];
      }),
  );

  return v.parse(ParsedDataSchema, raw);
}
