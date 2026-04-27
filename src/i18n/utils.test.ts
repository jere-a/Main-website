import { describe, expect, it } from "vitest";
import { defaultLang, type Lang, translations } from "./types";

const isLang = (value: string): value is keyof typeof translations => {
  return value in translations;
};

describe("isLang helper", () => {
  it("returns true for valid languages", () => {
    expect(isLang("fi")).toBe(true);
    expect(isLang("en")).toBe(true);
  });

  it("returns false for invalid languages", () => {
    expect(isLang("de")).toBe(false);
    expect(isLang("fr")).toBe(false);
    expect(isLang("")).toBe(false);
    expect(isLang("FI")).toBe(false);
  });
});

describe("useTranslations logic", () => {
  const createTranslator = <T extends Record<string, unknown>>(dict: T) => dict;

  const useTranslations = (lang: Lang = defaultLang) => {
    return createTranslator(translations[lang] ?? translations[defaultLang]);
  };

  it("returns Finnish by default", () => {
    const t = useTranslations();
    expect(t.nav.home).toBe(translations.fi.nav.home);
  });

  it("returns English for 'en'", () => {
    const t = useTranslations("en");
    expect(t.nav.home).toBe(translations.en.nav.home);
  });

  it("falls back to fi for unknown language", () => {
    const t = useTranslations("de" as Lang);
    expect(t.nav.home).toBe(translations.fi.nav.home);
  });
});

describe("getLangFromUrl logic", () => {
  const getLangFromUrl = (maybeLang: string | null): Lang => {
    return maybeLang && isLang(maybeLang) ? maybeLang : defaultLang;
  };

  it("returns 'fi' when URL has fi locale", () => {
    expect(getLangFromUrl("fi")).toBe("fi");
  });

  it("returns 'en' when URL has en locale", () => {
    expect(getLangFromUrl("en")).toBe("en");
  });

  it("returns default lang for unknown locale", () => {
    expect(getLangFromUrl("de")).toBe("fi");
  });

  it("returns default lang when getLocale returns null", () => {
    expect(getLangFromUrl(null)).toBe("fi");
    expect(getLangFromUrl(undefined as unknown as string)).toBe("fi");
  });
});

describe("useTranslatedPath logic", () => {
  const useTranslatedPath = <L extends string>(lang: L) => {
    const baseLang: Lang = isLang(lang) ? lang : defaultLang;

    const translatePath = (path: string, overrideLang?: string): string => {
      const finalLang: Lang =
        overrideLang && isLang(overrideLang) ? overrideLang : baseLang;
      return `/${finalLang}${path}`;
    };
    return translatePath;
  };

  it("generates path with correct language prefix", () => {
    const translate = useTranslatedPath("fi");
    expect(translate("/blog")).toBe("/fi/blog");
  });

  it("uses overrideLang when provided", () => {
    const translate = useTranslatedPath("fi");
    expect(translate("/blog", "en")).toBe("/en/blog");
  });

  it("falls back to baseLang for invalid override", () => {
    const translate = useTranslatedPath("fi");
    expect(translate("/blog", "de")).toBe("/fi/blog");
  });
});
