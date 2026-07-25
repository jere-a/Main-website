import { describe, expect, it } from "vitest";
import { Langs, defaultLang, translationLoaders } from "./types";
import type { Lang } from "./types";

describe("Langs", () => {
  it("defines Fi and En language codes", () => {
    expect(Langs.Fi).toBe("fi");
    expect(Langs.En).toBe("en");
  });

  it("has exactly 2 entries", () => {
    expect(Object.keys(Langs)).toHaveLength(2);
    expect(Object.values(Langs)).toHaveLength(2);
  });
});

describe("defaultLang", () => {
  it("is Finnish", () => {
    expect(defaultLang).toBe("fi");
  });

  it("matches Langs.Fi", () => {
    expect(defaultLang).toBe(Langs.Fi);
  });
});

describe("translationLoaders", () => {
  it("has loaders for all supported languages", () => {
    expect(typeof translationLoaders.fi).toBe("function");
    expect(typeof translationLoaders.en).toBe("function");
  });

  it("fi loader returns an object with expected top-level keys", async () => {
    const translations = await translationLoaders.fi();
    expect(translations).toHaveProperty("nav");
    expect(translations).toHaveProperty("index");
    expect(translations).toHaveProperty("about");
    expect(translations).toHaveProperty("images");
    expect(translations).toHaveProperty("notfound");
    expect(translations).toHaveProperty("footer");
    expect(translations).toHaveProperty("holiday");
  });

  it("en loader returns an object with expected top-level keys", async () => {
    const translations = await translationLoaders.en();
    expect(translations).toHaveProperty("nav");
    expect(translations).toHaveProperty("index");
    expect(translations).toHaveProperty("about");
    expect(translations).toHaveProperty("images");
    expect(translations).toHaveProperty("notfound");
    expect(translations).toHaveProperty("footer");
    expect(translations).toHaveProperty("holiday");
  });

  it("both locales have the same structure", async () => {
    const fi = await translationLoaders.fi();
    const en = await translationLoaders.en();

    const fiKeys = Object.keys(fi).sort();
    const enKeys = Object.keys(en).sort();
    expect(fiKeys).toEqual(enKeys);
  });

  it("holiday keys match between locales", async () => {
    const fi = await translationLoaders.fi();
    const en = await translationLoaders.en();

    expect(Object.keys(fi.holiday).sort()).toEqual(Object.keys(en.holiday).sort());
  });

  it("translation values are strings", async () => {
    const fi = await translationLoaders.fi();
    expect(typeof fi.nav.home).toBe("string");
    expect(typeof fi.index.title).toBe("string");
  });
});
