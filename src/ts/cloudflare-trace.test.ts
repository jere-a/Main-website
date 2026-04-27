import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config", () => ({
  siteConfig: {
    url: "https://example.com",
  },
}));

describe("fetchData", () => {
  const validTrace = `ip=192.168.1.1
uag=Mozilla/5.0
tls=TLS 1.3
loc=FI
http=HTTP/2
h=cloudflare`;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches trace data from correct endpoint", async () => {
    const mockResponse = {
      text: () => Promise.resolve(validTrace),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { fetchData } = await import("@/ts/cloudflare-trace");
    await fetchData();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/cdn-cgi/trace",
    );
  });

  it("parses valid trace data", async () => {
    const mockResponse = {
      text: () => Promise.resolve(validTrace),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { fetchData } = await import("@/ts/cloudflare-trace");
    const result = await fetchData();

    expect(result).toEqual({
      ip: "192.168.1.1",
      uag: "Mozilla/5.0",
      tls: "TLS 1.3",
      loc: "FI",
      http: "HTTP/2",
      h: "cloudflare",
    });
  });

  it("filters to only known keys", async () => {
    const mockResponse = {
      text: () =>
        Promise.resolve(`ip=1.2.3.4
unknown=value
uag=test-agent
other=ignored`),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { fetchData } = await import("@/ts/cloudflare-trace");
    const result = await fetchData();

    expect(result).toEqual({
      ip: "1.2.3.4",
      uag: "test-agent",
    });
    expect(result.unknown).toBeUndefined();
    expect(result.other).toBeUndefined();
  });

  it("handles empty values", async () => {
    const mockResponse = {
      text: () => Promise.resolve("ip=\nuag=\nloc="),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { fetchData } = await import("@/ts/cloudflare-trace");
    const result = await fetchData();

    expect(result.ip).toBe("");
  });

  it("returns empty object for empty trace", async () => {
    const mockResponse = {
      text: () => Promise.resolve(""),
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockResponse,
    );

    const { fetchData } = await import("@/ts/cloudflare-trace");
    const result = await fetchData();

    expect(result).toEqual({});
  });
});
