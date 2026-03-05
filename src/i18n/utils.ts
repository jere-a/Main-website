import { getRelativeLocaleUrl } from "astro:i18n";
import {
  defaultLang,
  type Lang,
  type TranslationShape,
  translations,
} from "./types.ts";

// export const languages = {
//   fi: "Suomi",
//   en: "English",
// } as const;

function isLang(value: string): value is keyof typeof translations {
  return value in translations;
}

function createTranslator<T extends TranslationShape>(dict: T) {
  return dict;
}

export function useTranslations(lang: Lang = defaultLang) {
  return createTranslator(translations[lang] ?? translations[defaultLang]);
}

// const translations = { fi, en } as const;
// export type TranslationKeys = typeof fi;
//
// function getNestedValue(obj: Record<string, unknown>, path: string): string {
//   const keys = path.split(".");
//   let result: unknown = obj;
//   for (const key of keys) {
//     if (result && typeof result === "object" && key in result) {
//       result = (result as Record<string, unknown>)[key];
//     } else {
//       return path;
//     }
//   }
//   return typeof result === "string" ? result : path;
// }

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");
  return maybeLang && isLang(maybeLang) ? maybeLang : defaultLang;
}

// export function useTranslations<L extends Lang>(lang: L) {
//   const dict = translations[lang] ?? translations[defaultLang];
//
//   function t(key: string): string {
//     return getNestedValue(dict as Record<string, unknown>, key);
//   }
//
//   return t;
// }

// export function tr<L extends Lang>(lang: L) {
//   return useTranslations(lang);
// }

export function useTranslatedPath<L extends string>(lang: L) {
  const baseLang: Lang = isLang(lang) ? lang : defaultLang;

  return function translatePath(path: string, overrideLang?: string): string {
    const finalLang: Lang =
      overrideLang && isLang(overrideLang) ? overrideLang : baseLang;

    return getRelativeLocaleUrl(finalLang, path);
  };
}

export const showDefaultLang = false;
export const ui = translations;
