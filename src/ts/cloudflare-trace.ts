import { siteConfig } from "@/config";

export type ParsedData = {
  ip: string;
  uag: string;
  tls: string;
  loc: string;
  http: string;
  h: string;
};

export async function fetchData(): Promise<ParsedData> {
  const text = (await fetch(`${siteConfig.url}/cdn-cgi/trace`)).text();

  const lines = (await text).split("\n");
  const result: Partial<ParsedData> = {};

  lines.forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      switch (key) {
        case "ip":
        case "uag":
        case "tls":
        case "loc":
        case "http":
        case "h":
          result[key as keyof ParsedData] = value;
          break;
      }
    }
  });

  // Ensure all required fields are present
  return result as ParsedData;
}
