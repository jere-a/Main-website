import { describe, expect, it, vi } from "vitest";

vi.mock("astro-i18n-aut", () => ({
  getLocale: (url: URL) => {
    const segment = url.pathname.split("/")[1];
    return segment ?? undefined;
  },
  getLocaleUrl: (path: string, lang: string) => `/${lang}${path}`,
}));

describe("i18n utils", () => {
  describe("isLang", () => {
    it("returns true for valid language codes", async () => {
      const { isLang } = await import("./utils");
      expect(isLang("fi")).toBe(true);
      expect(isLang("en")).toBe(true);
    });

    it.each([
      ["de", "unsupported language"],
      ["fr", "unsupported language"],
      ["", "empty string"],
      ["english", "full language name"],
      ["FI", "uppercase code"],
      ["EN", "uppercase code"],
      ["fi-fi", "region-qualified code"],
    ])("returns false for %s (%s)", async (value) => {
      const { isLang } = await import("./utils");
      expect(isLang(value)).toBe(false);
    });

    it("returns false for null and undefined", async () => {
      const { isLang } = await import("./utils");
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      expect(isLang(null as never)).toBe(false);
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      expect(isLang(undefined as never)).toBe(false);
    });
  });

  describe("getLangFromUrl", () => {
    it.each([
      ["https://ozze.eu.org/en/about", "en"],
      ["https://ozze.eu.org/fi/koti", "fi"],
      ["https://ozze.eu.org/en/blog/some-post", "en"],
      ["https://ozze.eu.org/en/", "en"],
      ["https://ozze.eu.org/en/about?x=1", "en"],
    ])("extracts %s -> %s", async (url, expected) => {
      const { getLangFromUrl } = await import("./utils");
      expect(getLangFromUrl(new URL(url))).toBe(expected);
    });

    it.each([
      ["https://ozze.eu.org/", "root path"],
      ["https://ozze.eu.org/de/hallo", "unrecognized language prefix"],
      ["https://ozze.eu.org/EN/about", "uppercase language prefix"],
      ["https://ozze.eu.org/about", "path without language prefix"],
    ])("returns defaultLang for %s (%s)", async (url) => {
      const { getLangFromUrl } = await import("./utils");
      expect(getLangFromUrl(new URL(url))).toBe("fi");
    });
  });

  describe("useTranslatedPath", () => {
    it("returns a function", async () => {
      const { useTranslatedPath } = await import("./utils");
      expect(typeof useTranslatedPath("fi")).toBe("function");
    });

    it.each([
      ["fi", "/about"],
      ["en", "/about"],
    ])("generates a path for %s", async (lang, path) => {
      const { useTranslatedPath } = await import("./utils");
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const generated = useTranslatedPath(lang as never)(path);
      expect(generated).toBe(`/${lang}/about`);
    });

    it("strips the trailing /index suffix", async () => {
      const { useTranslatedPath } = await import("./utils");
      expect(useTranslatedPath("fi")("/blog/index")).toBe("/fi/blog");
    });

    it("handles an empty path", async () => {
      const { useTranslatedPath } = await import("./utils");
      expect(useTranslatedPath("fi")("")).toBe("/fi");
    });

    it.each([
      ["de", "unsupported lang"],
      ["FI", "uppercase lang"],
    ])("falls back to defaultLang for %s (%s)", async (lang) => {
      const { useTranslatedPath } = await import("./utils");
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const path = useTranslatedPath(lang as never)("/about");
      expect(path).toBe("/fi/about");
    });

    it("supports a lang override", async () => {
      const { useTranslatedPath } = await import("./utils");
      const path = useTranslatedPath("fi")("/about", "en");
      expect(path).toBe("/en/about");
    });

    it("ignores an invalid lang override", async () => {
      const { useTranslatedPath } = await import("./utils");
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const path = useTranslatedPath("fi")("/about", "de" as never);
      expect(path).toBe("/fi/about");
    });
  });

  describe("useTranslations", () => {
    it("returns Finnish translations by default", async () => {
      const { useTranslations } = await import("./utils");
      const t = await useTranslations();
      expect(t.nav.home).toBe("Koti");
    });

    it("returns translations for English", async () => {
      const { useTranslations } = await import("./utils");
      const t = await useTranslations("en");
      expect(t.nav.home).toBe("Home");
    });

    it("returns translations for Finnish", async () => {
      const { useTranslations } = await import("./utils");
      const t = await useTranslations("fi");
      expect(t.nav.home).toBe("Koti");
    });

    it.each(["de", "", "EN"])("throws for unsupported language %j", async (lang) => {
      const { useTranslations } = await import("./utils");
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      await expect(useTranslations(lang as never)).rejects.toThrow("not a function");
    });
  });
});
