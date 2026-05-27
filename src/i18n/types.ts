import type { fi } from "./locales/fi.ts";

export const Langs = {
  Fi: "fi",
  En: "en",
} as const;

export type Lang = (typeof Langs)[keyof typeof Langs];
export const defaultLang: Lang = Langs.Fi;

export type DefaultSchema = typeof fi;

const loaders = Object.fromEntries(
  Object.values(Langs).map((lang) => [
    lang,
    () => import(`./locales/${lang}.ts`).then((m) => m[lang as keyof typeof m]),
  ]),
) as Record<Lang, () => Promise<DefaultSchema>>;

export const translationLoaders = loaders;
