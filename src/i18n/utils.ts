import { getLocale, getLocaleUrl } from "astro-i18n-aut";

import { defaultLang, type Lang, Langs, translationLoaders } from "./types.ts";

function includes<T extends readonly string[]>(array: T, value: string): value is T[number] {
  return array.includes(value);
}

export const langs = Object.values(Langs);
export const isLang = (v: string): v is Lang => includes(langs, v);

export async function useTranslations(lang: Lang = defaultLang) {
  return await translationLoaders[lang]();
}
export const getLangFromUrl = (url: URL): Lang => {
  const maybeLang = getLocale(url);
  return maybeLang && isLang(maybeLang) ? maybeLang : defaultLang;
};
export const useTranslatedPath = (lang: Lang) => {
  const baseLang: Lang = isLang(lang) ? lang : defaultLang;

  return (path: string, overrideLang?: Lang) =>
    getLocaleUrl(path, overrideLang && isLang(overrideLang) ? overrideLang : baseLang).replace(
      /\/index$/,
      "",
    );
};
