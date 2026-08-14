// oxlint-disable vitest/require-to-throw-message
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchData } from "./cloudflare-trace";

const mockFetchText = (text: string) =>
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  vi.spyOn(global, "fetch").mockResolvedValue({
    text: () => Promise.resolve(text),
  } as Response);

const validTrace = (overrides: Partial<Record<string, string>> = {}) => ({
  ip: "1.2.3.4",
  uag: "Mozilla/5.0",
  tls: "TLSv1.3",
  loc: "US",
  http: "http/2",
  h: "example.com",
  ...overrides,
});

const traceBody = (fields: Record<string, string>) =>
  Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

describe("fetchData", () => {
  afterEach(() => vi.restoreAllMocks());

  it("parses valid data", async () => {
    const trace = validTrace();
    mockFetchText(traceBody(trace));

    await expect(fetchData()).resolves.toEqual(trace);
  });

  describe("validation", () => {
    it.each([
      ["ip", ["1.2.3.4", "::1", "2001:db8::1"], ["", "1.2.3", "invalid"]],
      ["uag", ["Mozilla/5.0", "Agent/1.0"], [""]],
      ["tls", ["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"], ["", "TLS", "TLSv1.4"]],
      ["loc", ["FI", "US", "DE"], ["", "fi", "FIN", "F1"]],
      ["http", ["http/1.0", "http/1.1", "http/2", "http/3"], ["", "HTTP/2", "HTTP/4"]],
      ["h", ["example.com", "localhost"], [""]],
    ] as const)("%s accepts valid and rejects invalid values", async (key, valid, invalid) => {
      for (const value of valid) {
        mockFetchText(traceBody(validTrace({ [key]: value })));
        await expect(fetchData()).resolves.toMatchObject({ [key]: value });
        vi.restoreAllMocks();
      }

      for (const value of invalid) {
        mockFetchText(traceBody(validTrace({ [key]: value })));
        await expect(fetchData()).rejects.toThrow();
        vi.restoreAllMocks();
      }
    });

    it.each(["ip", "uag", "tls", "loc", "http", "h"])("requires %s", async (key) => {
      const trace = validTrace();
      delete trace[key as keyof typeof trace];

      mockFetchText(traceBody(trace));

      await expect(fetchData()).rejects.toThrow();
    });
  });

  describe("parsing", () => {
    it("ignores unknown keys", async () => {
      mockFetchText(
        traceBody({
          ...validTrace(),
          unknown: "value",
        }),
      );

      await expect(fetchData()).resolves.toEqual(validTrace());
    });

    it("preserves '=' in values", async () => {
      const trace = validTrace({ uag: "Agent=a=b" });
      mockFetchText(traceBody(trace));

      await expect(fetchData()).resolves.toMatchObject({
        uag: "Agent=a=b",
      });
    });

    it("accepts CRLF and blank lines", async () => {
      mockFetchText(
        [
          "ip=1.2.3.4",
          "",
          "uag=Mozilla/5.0",
          "tls=TLSv1.2",
          "",
          "loc=FI",
          "http=http/2",
          "h=example.com",
        ].join("\r\n"),
      );

      await expect(fetchData()).resolves.toEqual(
        validTrace({
          tls: "TLSv1.2",
          loc: "FI",
        }),
      );
    });

    it("rejects malformed key lines", async () => {
      mockFetchText(
        [
          "IP=1.2.3.4",
          "uag=Mozilla/5.0",
          "tls=TLSv1.3",
          "loc=FI",
          "http=HTTP/2",
          "h=example.com",
        ].join("\n"),
      );

      await expect(fetchData()).rejects.toThrow();
    });

    it("rejects an empty response", async () => {
      mockFetchText("");

      await expect(fetchData()).rejects.toThrow();
    });
  });

  describe("errors", () => {
    it("propagates fetch errors", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new TypeError("network error"));

      await expect(fetchData()).rejects.toThrow("network error");
    });

    it("propagates body errors", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        text: () => Promise.reject(new Error("read failed")),
      } as Response);

      await expect(fetchData()).rejects.toThrow("read failed");
    });
  });

  it("fetches the trace endpoint", async () => {
    mockFetchText(traceBody(validTrace()));

    await fetchData();

    expect(global.fetch).toHaveBeenCalledWith(`${window.location.origin}/cdn-cgi/trace`);
  });
});
