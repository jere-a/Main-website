import { describe, expect, it } from "vitest";
import { type Lang, translations } from "./types";

describe("translations structure", () => {
  it("has required top-level keys for both languages", () => {
    const requiredKeys = [
      "nav",
      "index",
      "about",
      "images",
      "notfound",
      "youtube",
      "footer",
      "holiday",
    ] as const;

    for (const key of requiredKeys) {
      expect(translations.fi).toHaveProperty(key);
      expect(translations.en).toHaveProperty(key);
    }
  });

  it("nav structure is complete", () => {
    expect(translations.fi.nav).toHaveProperty("home");
    expect(translations.fi.nav).toHaveProperty("about");
    expect(translations.fi.nav).toHaveProperty("images");
    expect(translations.fi.nav).toHaveProperty("blog");
  });

  it("blog nav has required nested structure", () => {
    expect(translations.fi.nav.blog).toHaveProperty("title");
    expect(translations.fi.nav.blog).toHaveProperty("desc");
  });

  it("holiday object has all holidays", () => {
    expect(translations.fi.holiday).toHaveProperty("christmas");
    expect(translations.fi.holiday).toHaveProperty("newyear");
    expect(translations.fi.holiday).toHaveProperty("halloween");
  });

  it("all translation values are non-empty strings", () => {
    const checkStrings = (obj: Record<string, unknown>, path = ""): void => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === "string") {
          expect(
            value.length,
            `Empty string at ${currentPath}`,
          ).toBeGreaterThan(0);
        } else if (typeof value === "object" && value !== null) {
          checkStrings(value as Record<string, unknown>, currentPath);
        }
      }
    };

    checkStrings(translations.fi as unknown as Record<string, unknown>);
    checkStrings(translations.en as unknown as Record<string, unknown>);
  });

  it("fi and en have same structure (same keys)", () => {
    const fiKeys = JSON.stringify(Object.keys(translations.fi).sort());
    const enKeys = JSON.stringify(Object.keys(translations.en).sort());
    expect(fiKeys).toBe(enKeys);
  });
});

describe("Lang type", () => {
  it("accepts valid language codes", () => {
    const fi: Lang = "fi";
    const en: Lang = "en";
    expect(fi).toBe("fi");
    expect(en).toBe("en");
  });
});
