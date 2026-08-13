import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchData } from "./cloudflare-trace";

const mockFetchText = (text: string) => {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  vi.spyOn(global, "fetch").mockResolvedValue({
    text: () => Promise.resolve(text),
  } as Response);
};

const validTrace = (overrides: Partial<Record<string, string>> = {}): Record<string, string> => ({
  ip: "1.2.3.4",
  uag: "Mozilla/5.0",
  tls: "TLSv1.3",
  loc: "US",
  http: "2",
  h: "abc123",
  ...overrides,
});

const traceBody = (fields: Record<string, string>) =>
  Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

describe("fetchData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses a valid trace response", async () => {
    const trace = validTrace();
    mockFetchText(traceBody(trace));

    expect(await fetchData()).toEqual(trace);
  });

  it.each([
    ["ip", 'Invalid key: Expected "ip" but received undefined'],
    ["uag", 'Invalid key: Expected "uag" but received undefined'],
    ["tls", 'Invalid key: Expected "tls" but received undefined'],
    ["loc", 'Invalid key: Expected "loc" but received undefined'],
    ["http", 'Invalid key: Expected "http" but received undefined'],
    ["h", 'Invalid key: Expected "h" but received undefined'],
  ])("throws when the %s field is missing", async (missing, message) => {
    const trace = validTrace();
    delete trace[missing];
    mockFetchText(traceBody(trace));

    await expect(fetchData()).rejects.toThrow(message);
  });

  it("handles empty values for all fields", async () => {
    mockFetchText("ip=\nuag=\ntls=\nloc=\nhttp=\nh=");

    expect(await fetchData()).toEqual({ ip: "", uag: "", tls: "", loc: "", http: "", h: "" });
  });

  it("treats a known key line without '=' as an empty string", async () => {
    mockFetchText("ip\nuag=Agent/1.0\ntls=TLSv1.3\nloc=FI\nhttp=2\nh=xyz");

    expect((await fetchData()).ip).toBe("");
  });

  it("ignores unrecognized keys", async () => {
    mockFetchText(
      "ip=5.6.7.8\nunknown_key=value\nuag=Agent/1.0\ntls=TLSv1.2\nloc=FI\nhttp=2\nh=xyz",
    );

    const result = await fetchData();
    expect(result.ip).toBe("5.6.7.8");
    expect(result.uag).toBe("Agent/1.0");
  });

  it("ignores uppercase and whitespace-padded keys", async () => {
    mockFetchText("IP=1.2.3.4\nuag =Agent\ntls=TLSv1.2\nloc=US\nhttp=2\nh=x");

    await expect(fetchData()).rejects.toThrow('Invalid key: Expected "ip" but received undefined');
  });

  it("preserves extra '=' characters within the value", async () => {
    mockFetchText("ip=1.2.3.4=extra\nuag=Agent\ntls=TLSv1.2\nloc=US\nhttp=2\nh=x");

    expect((await fetchData()).ip).toBe("1.2.3.4=extra");
  });

  it("skips blank lines within the response", async () => {
    mockFetchText("ip=1.2.3.4\n\nuag=Agent\n\ntls=TLSv1.2\nloc=US\nhttp=2\nh=x");

    const result = await fetchData();
    expect(result.ip).toBe("1.2.3.4");
    expect(result.uag).toBe("Agent");
  });

  it("parses CRLF line endings", async () => {
    mockFetchText("ip=1.2.3.4\r\nuag=Agent\r\ntls=TLSv1.2\r\nloc=US\r\nhttp=2\r\nh=x");

    const result = await fetchData();
    expect(result.ip).toBe("1.2.3.4");
    expect(result.uag).toBe("Agent");
    expect(result.h).toBe("x");
  });

  it("throws when the response body is empty", async () => {
    mockFetchText("");

    await expect(fetchData()).rejects.toThrow('Invalid key: Expected "ip" but received undefined');
  });

  it("propagates fetch network errors", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new TypeError("network error"));

    await expect(fetchData()).rejects.toThrow("network error");
  });

  it("propagates response body errors", async () => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    vi.spyOn(global, "fetch").mockResolvedValue({
      text: () => Promise.reject(new Error("read failed")),
    } as Response);

    await expect(fetchData()).rejects.toThrow("read failed");
  });

  it("calls fetch with the current origin trace endpoint", async () => {
    mockFetchText(traceBody(validTrace()));

    await fetchData();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const url = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
    expect(url).toBe(`${window.location.origin}/cdn-cgi/trace`);
  });
});
