/**
 * I18n type definitions and locale loader registry. Defines the Lang type, default language, and
 * lazy-loaded translation modules.
 */

import type { fi } from "./locales/fi.ts";

/** Supported language codes. */
export const Langs = {
  Fi: "fi",
  En: "en",
} as const;

/** Union type of supported language codes. */
export type Lang = (typeof Langs)[keyof typeof Langs];

/** Fallback language when no match is found. */
export const defaultLang = Langs.Fi;

/** Recursively stringify all leaf values of a type (translation values are always strings). */
type Stringify<T> = {
  readonly [K in keyof T]: T[K] extends object ? Stringify<T[K]> : string;
};

/** The canonical translation schema, derived from the Finnish locale. */
export type DefaultSchema = Stringify<typeof fi>;

type LocaleModule = {
  [K in Lang]: DefaultSchema;
};

/** Dynamically import a locale file and return its translation object. */
async function loadLocale(lang: Lang): Promise<DefaultSchema> {
  const module: LocaleModule = await import(`./locales/${lang}.ts`);
  return module[lang];
}

/** Lazy-loaded translation functions keyed by language code. */
export const translationLoaders: Record<Lang, () => Promise<DefaultSchema>> = {
  [Langs.Fi]: () => loadLocale(Langs.Fi),
  [Langs.En]: () => loadLocale(Langs.En),
};
