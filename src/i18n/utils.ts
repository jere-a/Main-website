/**
 * I18n utility functions. Provides language detection from URLs, translation loading, and path
 * generation for localized routes.
 */

import { getLocale, getLocaleUrl } from "astro-i18n-aut";

import { defaultLang, type Lang, Langs, translationLoaders } from "./types.ts";

/** Type guard: check if a string is a supported language code. */
function includes<T extends readonly string[]>(array: T, value: string): value is T[number] {
  return array.includes(value);
}

/** Array of all supported language codes. */
export const langs = Object.values(Langs);

/** Type guard: check if a value is a valid Lang. */
export const isLang = (v: string): v is Lang => includes(langs, v);

/** Load translations for the given language. Defaults to the default language. */
export async function useTranslations(lang: Lang = defaultLang) {
  return await translationLoaders[lang]();
}

/** Extract the language code from a URL, falling back to defaultLang. */
export const getLangFromUrl = (url: URL): Lang => {
  const maybeLang = getLocale(url);
  return maybeLang && isLang(maybeLang) ? maybeLang : defaultLang;
};

/**
 * Create a function that generates localized paths. Returns a function: (path, overrideLang?) =>
 * localized URL string.
 */
export const useTranslatedPath = (lang: Lang) => {
  const baseLang: Lang = isLang(lang) ? lang : defaultLang;

  return (path: string, overrideLang?: Lang) =>
    getLocaleUrl(path, overrideLang && isLang(overrideLang) ? overrideLang : baseLang).replace(
      /\/index$/,
      "",
    );
};
