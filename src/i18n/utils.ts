import { defaultLang, showDefaultLang, type UI, ui } from "./ui";

/* -------------------------------------------------- */
/* UNICODE ESCAPE - COMPILE TIME CONVERSION */
/* -------------------------------------------------- */

type EscapeMap = {
  Ä: "\\u00C4";
  ä: "\\u00E4";
  Ö: "\\u00D6";
  ö: "\\u00F6";
  Å: "\\u00C5";
  å: "\\u00E5";
};

type EscapeChar<K extends string> = K extends keyof EscapeMap
  ? EscapeMap[K]
  : K;

type ToUnicode<S extends string> = S extends `${infer C}${infer Rest}`
  ? EscapeChar<C> extends string
    ? `${EscapeChar<C>}${ToUnicode<Rest>}`
    : `${C}${ToUnicode<Rest>}`
  : S;

export type UnicodeEscaped<T extends string> = ToUnicode<T>;

function toUnicode<const T extends string>(str: T): UnicodeEscaped<T> {
  const escapeMap: Record<string, string> = {
    Ä: "\\u00C4",
    ä: "\\u00E4",
    Ö: "\\u00D6",
    ö: "\\u00F6",
    Å: "\\u00C5",
    å: "\\u00E5",
  };

  let result = "";
  for (const char of str) {
    result += escapeMap[char] ?? char;
  }
  return result as UnicodeEscaped<T>;
}

export const unicode = {
  toUnicode,
  escape: toUnicode,
};

/* -------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------- */

export type Lang = keyof UI;
export type TranslationKey = keyof UI[typeof defaultLang];

/* -------------------------------------------------- */
/* STRONG TYPES - COMPILE TIME KEY EXTRACTION */
/* -------------------------------------------------- */

export type TranslationKeys<T extends UI> = {
  [K in keyof T]: keyof T[K];
}[keyof T];

export type TranslationsForLang<L extends Lang> = UI[L];

export type TranslationValue<
  L extends Lang,
  K extends TranslationKey,
> = UI[L][K];

/* -------------------------------------------------- */
/* TYPE GUARD */
/* -------------------------------------------------- */

const langs = ["fi", "en"] as const;

function isLang(value: string): value is Lang {
  return langs.includes(value as Lang);
}

/* -------------------------------------------------- */
/* getLangFromUrl */
/* -------------------------------------------------- */

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");

  return maybeLang && isLang(maybeLang) ? maybeLang : defaultLang;
}

/* -------------------------------------------------- */
/* useTranslations */
/* -------------------------------------------------- */

export function useTranslations<L extends Lang>(lang: L) {
  return function t<K extends TranslationKey>(key: K): UI[L][K] {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/* -------------------------------------------------- */
/* useTranslatedPath */
/* -------------------------------------------------- */

export function useTranslatedPath<L extends string>(lang: L) {
  const baseLang: Lang = isLang(lang) ? lang : defaultLang;

  return function translatePath(path: string, overrideLang?: string): string {
    const finalLang: Lang =
      overrideLang && isLang(overrideLang) ? overrideLang : baseLang;

    if (!showDefaultLang && finalLang === defaultLang) {
      return path;
    }

    return `/${finalLang}${path}`;
  };
}

/* -------------------------------------------------- */
/* iterator */
/* -------------------------------------------------- */

export function iterator<T>(data: T): T[] {
  return [data];
}
