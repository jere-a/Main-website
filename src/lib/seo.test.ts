import { describe, expect, it } from "vitest";

import {
  articleJsonLd,
  getAlternateOgLocales,
  getOgLocale,
  serializeJsonLd,
  websiteJsonLd,
} from "./seo";

describe("getOgLocale", () => {
  it('returns "fi_FI" for "fi"', () => {
    expect(getOgLocale("fi")).toBe("fi_FI");
  });

  it('returns "en_US" for "en"', () => {
    expect(getOgLocale("en")).toBe("en_US");
  });

  it("falls back to the default locale for unknown languages", () => {
    expect(getOgLocale("xx")).toBe("fi_FI");
  });
});

describe("getAlternateOgLocales", () => {
  it('returns ["en_US"] for "fi"', () => {
    expect(getAlternateOgLocales("fi")).toEqual(["en_US"]);
  });

  it('returns ["fi_FI"] for "en"', () => {
    expect(getAlternateOgLocales("en")).toEqual(["fi_FI"]);
  });

  it("returns all locales when the language is not supported", () => {
    expect(getAlternateOgLocales("xx")).toEqual(["fi_FI", "en_US"]);
  });
});

describe("serializeJsonLd", () => {
  it("escapes angle brackets to prevent script injection", () => {
    expect(serializeJsonLd({ text: "<script>" })).toBe('{"text":"\\u003cscript>"}');
  });
});

describe("websiteJsonLd", () => {
  it("builds a WebSite JSON-LD object", () => {
    const result = websiteJsonLd({
      url: "https://example.com",
      name: "Site",
      description: "Desc",
      lang: "fi",
      author: "Jane",
    });

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Site",
      url: "https://example.com",
      description: "Desc",
      inLanguage: "fi",
      author: { "@type": "Person", name: "Jane" },
    });
  });
});

describe("articleJsonLd", () => {
  it("builds a BlogPosting without optional fields", () => {
    const result = articleJsonLd({
      url: "https://example.com/p",
      headline: "Hello",
      lang: "en",
      datePublished: "2024-01-02T03:04:05.000Z",
      author: "Jane",
    });

    expect(result["@type"]).toBe("BlogPosting");
    expect(result.headline).toBe("Hello");
    expect(result.inLanguage).toBe("en");
    expect(result.datePublished).toBe("2024-01-02T03:04:05.000Z");
    expect(result.author).toEqual({ "@type": "Person", name: "Jane" });
    expect(result.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": "https://example.com/p",
    });
    expect(result).not.toHaveProperty("dateModified");
    expect(result).not.toHaveProperty("image");
  });

  it("includes optional dateModified and image fields", () => {
    const result = articleJsonLd({
      url: "https://example.com/p",
      headline: "Hello",
      lang: "en",
      datePublished: "2024-01-02T03:04:05.000Z",
      dateModified: "2024-02-03T00:00:00.000Z",
      image: "https://example.com/p.png",
      author: "Jane",
    });

    expect(result.dateModified).toBe("2024-02-03T00:00:00.000Z");
    expect(result.image).toBe("https://example.com/p.png");
  });
});
