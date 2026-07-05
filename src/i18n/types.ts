import type { fi } from "./locales/fi.ts";

export const Langs = {
  Fi: "fi",
  En: "en",
} as const;

export type Lang = (typeof Langs)[keyof typeof Langs];
export const defaultLang = Langs.Fi;

type Stringify<T> = {
  readonly [K in keyof T]: T[K] extends object ? Stringify<T[K]> : string;
};

export type DefaultSchema = Stringify<typeof fi>;

type LocaleModule = {
  [K in Lang]: DefaultSchema;
};

async function loadLocale(lang: Lang): Promise<DefaultSchema> {
  const module: LocaleModule = await import(`./locales/${lang}.ts`);
  return module[lang];
}

export const translationLoaders: Record<Lang, () => Promise<DefaultSchema>> = {
  [Langs.Fi]: () => loadLocale(Langs.Fi),
  [Langs.En]: () => loadLocale(Langs.En),
};
