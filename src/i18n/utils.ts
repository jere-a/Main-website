import { getLocale, getLocaleUrl } from "astro-i18n-aut";

import { defaultLang, type Lang, Langs, translationLoaders } from "./types.ts";

export const isLang = (v: string): v is Lang => (Object.values(Langs) as string[]).includes(v);

export async function useTranslations(lang: Lang = defaultLang) {
  return await translationLoaders[lang]();
}
export const getLangFromUrl = (url: URL): Lang => {
  const maybeLang = getLocale(url);
  return maybeLang && isLang(maybeLang) ? maybeLang : defaultLang;
};
export const useTranslatedPath = <L extends string>(lang: L) => {
  const baseLang: Lang = isLang(lang) ? lang : defaultLang;

  return (path: string, overrideLang?: string) =>
    getLocaleUrl(path, overrideLang && isLang(overrideLang) ? overrideLang : baseLang).replace(
      /\/index$/,
      "",
    );
};

export const showDefaultLang = false;
export const ui = translationLoaders;
