import { describe, expect, it, vi } from "vitest";

vi.mock("astro-i18n-aut", () => ({
  getLocale: (url: URL) => url.pathname.split("/")[1],
  getLocaleUrl: (path: string, lang: string) => `/${lang}${path}`,
}));

import { en } from "./locales/en.ts";
import { fi } from "./locales/fi.ts";
import { getLangFromUrl, isLang, useTranslatedPath, useTranslations } from "./utils";

const translations = { fi, en } as const;
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const languages = Object.keys(translations) as (keyof typeof translations)[];

describe("i18n utils", () => {
  describe("isLang", () => {
    it.each(languages)("accepts %s", (lang) => {
      expect(isLang(lang)).toBe(true);
    });

    it.each(["", "de", "EN", "fi-FI", "english"])("rejects %s", (lang) => {
      expect(isLang(lang)).toBe(false);
    });
  });

  describe("getLangFromUrl", () => {
    it.each(languages)("extracts %s", (lang) => {
      expect(getLangFromUrl(new URL(`https://ozze.eu.org/${lang}/about`))).toBe(lang);
    });

    it.each(["/", "/de/about", "/EN/about"])("defaults for %s", (path) => {
      expect(getLangFromUrl(new URL(`https://ozze.eu.org${path}`))).toBe("fi");
    });
  });

  describe("useTranslatedPath", () => {
    it.each(languages)("generates %s paths", (lang) => {
      expect(useTranslatedPath(lang)("/about")).toBe(`/${lang}/about`);
    });

    it("supports overrides", () => {
      expect(useTranslatedPath("fi")("/about", "en")).toBe("/en/about");
    });

    it("falls back for invalid languages", () => {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      expect(useTranslatedPath("de" as never)("/about")).toBe("/fi/about");
    });
  });

  describe("useTranslations", () => {
    it.each(languages)("returns the %s translation object", async (lang) => {
      expect(await useTranslations(lang)).toBe(translations[lang]);
    });

    it("defaults to fi", async () => {
      expect(await useTranslations()).toBe(fi);
    });
  });
});
