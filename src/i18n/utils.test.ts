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

    it("returns false for unsupported languages", async () => {
      const { isLang } = await import("./utils");
      expect(isLang("de")).toBe(false);
      expect(isLang("fr")).toBe(false);
    });

    it("returns false for empty string", async () => {
      const { isLang } = await import("./utils");
      expect(isLang("")).toBe(false);
    });

    it("returns false for strings that are not language codes", async () => {
      const { isLang } = await import("./utils");
      expect(isLang("english")).toBe(false);
      expect(isLang("finnish")).toBe(false);
    });
  });

  describe("langs", () => {
    it("contains all supported language codes", async () => {
      const { langs } = await import("./utils");
      expect(langs).toContain("fi");
      expect(langs).toContain("en");
    });
  });

  describe("getLangFromUrl", () => {
    it("extracts language from URL path", async () => {
      const { getLangFromUrl } = await import("./utils");
      expect(getLangFromUrl(new URL("https://ozze.eu.org/en/about"))).toBe("en");
    });

    it("extracts fi from URL path", async () => {
      const { getLangFromUrl } = await import("./utils");
      expect(getLangFromUrl(new URL("https://ozze.eu.org/fi/koti"))).toBe("fi");
    });

    it("returns defaultLang for root path", async () => {
      const { getLangFromUrl } = await import("./utils");
      expect(getLangFromUrl(new URL("https://ozze.eu.org/"))).toBe("fi");
    });

    it("returns defaultLang for unrecognized language prefix", async () => {
      const { getLangFromUrl } = await import("./utils");
      expect(getLangFromUrl(new URL("https://ozze.eu.org/de/hallo"))).toBe("fi");
    });
  });

  describe("useTranslatedPath", () => {
    it("returns a function", async () => {
      const { useTranslatedPath } = await import("./utils");
      expect(typeof useTranslatedPath("fi")).toBe("function");
    });

    it("generates path for fi", async () => {
      const { useTranslatedPath } = await import("./utils");
      const path = useTranslatedPath("fi")("/about");
      expect(path).toContain("fi");
      expect(path).toContain("about");
    });

    it("generates path for en", async () => {
      const { useTranslatedPath } = await import("./utils");
      const path = useTranslatedPath("en")("/about");
      expect(path).toContain("en");
      expect(path).toContain("about");
    });

    it("falls back to defaultLang for invalid lang", async () => {
      const { useTranslatedPath } = await import("./utils");
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const path = useTranslatedPath("de" as never)("/about");
      expect(path).toContain("fi");
    });

    it("supports lang override", async () => {
      const { useTranslatedPath } = await import("./utils");
      const path = useTranslatedPath("fi")("/about", "en");
      expect(path).toContain("en");
    });
  });

  describe("useTranslations", () => {
    it("returns translations for default language", async () => {
      const { useTranslations } = await import("./utils");
      const t = await useTranslations();
      expect(t).toHaveProperty("nav");
      expect(t).toHaveProperty("index");
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
  });
});
