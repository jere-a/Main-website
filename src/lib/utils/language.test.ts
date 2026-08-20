import { afterEach, describe, expect, it, vi } from "vitest";

import { detectLanguage } from "./language";

const languages = ["en", "fi"];

const casePermutations = (value: string): string[] =>
  // oxlint-disable-next-line typescript/no-misused-spread
  [...value].reduce(
    (variants, char) =>
      variants.flatMap((prefix) => [prefix + char.toLowerCase(), prefix + char.toUpperCase()]),
    [""],
  );

const languageVariants = (lang: string) => {
  const variants = casePermutations(lang);

  return [
    ...variants,
    ...variants.flatMap((language) => variants.map((region) => `${language}-${region}`)),
  ];
};

describe("detectLanguage", () => {
  afterEach(() => {
    document.documentElement.lang = "";
    vi.unstubAllGlobals();
  });

  it.each(languages.flatMap((lang) => languageVariants(lang).map((variant) => [variant, lang])))(
    "detects %s as %s",
    (input, expected) => {
      expect(detectLanguage(input)).toBe(expected);
    },
  );

  it("prioritizes the argument", () => {
    document.documentElement.lang = "en";
    vi.stubGlobal("navigator", {
      languages: ["fi-FI"],
      language: "fi",
    });

    expect(detectLanguage("en")).toBe("en");
  });

  it.each([
    ["en", "en"],
    ["EN-US", "en"],
  ])("detects document.lang %s as %s", (lang, expected) => {
    document.documentElement.lang = lang;
    expect(detectLanguage()).toBe(expected);
  });

  it("uses the first supported navigator language", () => {
    vi.stubGlobal("navigator", {
      languages: ["zh-CN", "de", "EN-GB"],
      language: "",
    });

    expect(detectLanguage()).toBe("en");
  });

  it("falls back through all sources to fi", () => {
    vi.stubGlobal("navigator", { languages: [], language: "" });
    expect(detectLanguage()).toBe("fi");
  });
});
