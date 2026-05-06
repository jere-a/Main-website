import { en, fi } from "./locales";

export const translations = {
  fi,
  en,
} satisfies Record<string, typeof fi>;

export type Lang = keyof typeof translations;
export const defaultLang: Lang = "fi";

/* Translation schema */
type DefaultSchema = (typeof translations)[typeof defaultLang];

/* Dot-notation keys */
type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type Paths<T> = {
  [K in keyof T]: T[K] extends object ? K | Join<K & string, Paths<T[K]>> : K;
}[keyof T];

export type TranslationKeys = Paths<DefaultSchema>;

/* Deep typed shape */
type DeepObject<T> = {
  [K in keyof T]: T[K] extends object ? DeepObject<T[K]> : T[K];
};

export type TranslationShape = DeepObject<DefaultSchema>;
