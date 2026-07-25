import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchData } from "./cloudflare-trace";

describe("fetchData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses valid trace response", async () => {
    const traceResponse = `ip=1.2.3.4
uag=Mozilla/5.0
tls=TLSv1.3
loc=US
http=2
h=abc123`;

    vi.spyOn(global, "fetch").mockResolvedValue({
      text: () => Promise.resolve(traceResponse),
    } as Response);

    const result = await fetchData();
    expect(result.ip).toBe("1.2.3.4");
    expect(result.uag).toBe("Mozilla/5.0");
    expect(result.tls).toBe("TLSv1.3");
    expect(result.loc).toBe("US");
    expect(result.http).toBe("2");
    expect(result.h).toBe("abc123");
  });

  it("throws on invalid/missing required fields", async () => {
    const incomplete = `ip=1.2.3.4`;

    vi.spyOn(global, "fetch").mockResolvedValue({
      text: () => Promise.resolve(incomplete),
    } as Response);

    await expect(fetchData()).rejects.toThrow("Invalid trace data");
  });

  it("handles empty values for fields", async () => {
    const traceResponse = `ip=
uag=
tls=
loc=
http=
h=`;

    vi.spyOn(global, "fetch").mockResolvedValue({
      text: () => Promise.resolve(traceResponse),
    } as Response);

    const result = await fetchData();
    expect(result.ip).toBe("");
    expect(result.uag).toBe("");
  });

  it("ignores unrecognized keys", async () => {
    const traceResponse = `ip=5.6.7.8
unknown_key=value
uag=Agent/1.0
tls=TLSv1.2
loc=FI
http=2
h=xyz`;

    vi.spyOn(global, "fetch").mockResolvedValue({
      text: () => Promise.resolve(traceResponse),
    } as Response);

    const result = await fetchData();
    expect(result.ip).toBe("5.6.7.8");
    expect(result.uag).toBe("Agent/1.0");
  });

  it("calls fetch with the correct URL", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      text: () => Promise.resolve("ip=x\nuag=x\ntls=x\nloc=x\nhttp=x\nh=x"),
    } as Response);

    await fetchData();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
    expect(url).toContain("/cdn-cgi/trace");
  });
});
