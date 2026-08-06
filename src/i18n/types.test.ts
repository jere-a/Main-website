import { describe, expect, it } from "vitest";

import { Langs, defaultLang, translationLoaders } from "./types";

const leafKeys = (value: object, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    child !== null && typeof child === "object"
      ? leafKeys(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const valueAt = (root: object, key: string): unknown =>
  key.split(".").reduce<unknown>(
    (acc, part) =>
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      (acc as Record<string, unknown>)[part],
    root,
  );

describe("Langs", () => {
  it("defines Fi and En language codes in order", () => {
    expect(Langs).toEqual(["fi", "en"]);
  });

  it("contains defaultLang", () => {
    expect(Langs).toContain(defaultLang);
  });
});

describe("defaultLang", () => {
  it("is Finnish", () => {
    expect(defaultLang).toBe("fi");
  });

  it("matches the first entry of Langs", () => {
    expect(defaultLang).toBe(Langs[0]);
  });
});

describe("translationLoaders", () => {
  it("has a loader for every supported language", () => {
    for (const lang of Langs) {
      expect(typeof translationLoaders[lang]).toBe("function");
    }
  });

  it.each(["fi", "en"] as const)("%s loader returns a translations object", async (lang) => {
    const translations = await translationLoaders[lang]();
    expect(typeof translations).toBe("object");
    expect(translations).not.toBeNull();
  });

  it("both locales share identical leaf key structure", async () => {
    const fi = await translationLoaders.fi();
    const en = await translationLoaders.en();

    expect(leafKeys(fi).length).toBeGreaterThan(0);
    expect(leafKeys(fi).toSorted()).toEqual(leafKeys(en).toSorted());
  });

  it("every leaf value is a non-empty string in both locales", async () => {
    const fi = await translationLoaders.fi();
    const en = await translationLoaders.en();

    for (const translations of [fi, en]) {
      const label = translations === fi ? "fi" : "en";
      for (const key of leafKeys(translations)) {
        const value = valueAt(translations, key);
        expect(typeof value, `${label}.${key}`).toBe("string");
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        expect((value as string).length, `${label}.${key}`).toBeGreaterThan(0);
      }
    }
  });
});
