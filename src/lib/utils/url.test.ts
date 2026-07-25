import { describe, expect, it, afterEach } from "vitest";

import { getQueryParam } from "./url";

describe("getQueryParam", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("returns the value of an existing query parameter", () => {
    window.history.replaceState(null, "", "/?foo=bar");
    expect(getQueryParam("foo")).toBe("bar");
  });

  it("returns undefined for a missing query parameter", () => {
    window.history.replaceState(null, "", "/");
    expect(getQueryParam("missing")).toBeUndefined();
  });

  it("returns the first value for duplicate parameters", () => {
    window.history.replaceState(null, "", "/?key=first&key=second");
    expect(getQueryParam("key")).toBe("first");
  });

  it("returns empty string for key present but no value", () => {
    window.history.replaceState(null, "", "/?empty=");
    expect(getQueryParam("empty")).toBe("");
  });

  it("returns the value for key with no equals sign", () => {
    window.history.replaceState(null, "", "/?flag");
    expect(getQueryParam("flag")).toBe("");
  });

  it("handles URL-encoded values", () => {
    window.history.replaceState(null, "", "/?name=hello%20world");
    expect(getQueryParam("name")).toBe("hello world");
  });

  it("handles special characters", () => {
    window.history.replaceState(null, "", "/?q=a%26b%3Dc");
    expect(getQueryParam("q")).toBe("a&b=c");
  });

  it("returns undefined when URL has no search string", () => {
    window.history.replaceState(null, "", "/no-params");
    expect(getQueryParam("any")).toBeUndefined();
  });

  it("handles multiple different parameters", () => {
    window.history.replaceState(null, "", "/?a=1&b=2&c=3");
    expect(getQueryParam("a")).toBe("1");
    expect(getQueryParam("b")).toBe("2");
    expect(getQueryParam("c")).toBe("3");
  });
});
