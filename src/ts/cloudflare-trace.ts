import { siteConfig } from "@/config";

export type ParsedData = Record<string, string>;

export async function fetchData(): Promise<ParsedData> {
  const res = await fetch(`${siteConfig.url}/cdn-cgi/trace`);
  const text = await res.text();

  return Object.fromEntries(
    text
      .split("\n")
      .map((line) => line.split("="))
      .filter(
        ([key]) =>
          key && ["ip", "uag", "tls", "loc", "http", "h"].includes(key),
      )
      .map(([key, value]) => [key, value ?? ""]),
  );
}
