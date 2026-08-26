import { afterEach, describe, expect, it } from "vitest";

import { getQueryParam } from "./url";

describe("getQueryParam", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it.each([
    ["/?foo=bar", "foo", "bar"],
    ["/?key=first&key=second", "key", "first"],
    ["/?empty=", "empty", ""],
    ["/?flag", "flag", ""],
    ["/?name=hello%20world", "name", "hello world"],
    ["/?q=a%26b%3Dc", "q", "a&b=c"],
    ["/no-params", "any", undefined],
    ["/?Foo=1", "Foo", "1"],
    ["/?=value", "", "value"],
    ["/?q=a+b", "q", "a b"],
    ["/?q=héllo", "q", "héllo"],
  ])("returns %s for %s in %s", (url, key, expected) => {
    window.history.replaceState(null, "", url);
    expect(getQueryParam(key)).toBe(expected);
  });

  it("handles multiple different parameters", () => {
    window.history.replaceState(null, "", "/?a=1&b=2&c=3");

    expect(getQueryParam("a")).toBe("1");
    expect(getQueryParam("b")).toBe("2");
    expect(getQueryParam("c")).toBe("3");
  });

  it("is case-sensitive", () => {
    window.history.replaceState(null, "", "/?Foo=1");

    expect(getQueryParam("Foo")).toBe("1");
    expect(getQueryParam("foo")).toBeUndefined();
  });
});
