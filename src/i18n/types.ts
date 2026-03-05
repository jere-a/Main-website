import { en } from "./locales/en";
import { fi } from "./locales/fi";

export const translations = { fi, en } as const;
export type Lang = keyof typeof translations;

export const defaultLang: Lang = "fi";

/* missing check */

type DeepEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
      ? true
      : never
    : never;

type DeepValidate<A, B> =
  // Both are arrays → enforce same tuple shape
  A extends readonly unknown[]
    ? B extends readonly unknown[]
      ? DeepEqual<A, B>
      : never
    : B extends readonly unknown[]
      ? never
      : // Both objects → recurse
        A extends object
        ? B extends object
          ? {
              [K in keyof A & keyof B]: DeepValidate<A[K], B[K]>;
            }[keyof A & keyof B] extends never
            ? never
            : true
          : never
        : // Primitive comparison
          DeepEqual<A, B>;

type DefaultSchema = (typeof translations)[typeof defaultLang];

type ValidateTranslations = {
  [K in keyof typeof translations]: DeepValidate<
    (typeof translations)[K],
    DefaultSchema
  >;
}[keyof typeof translations];

/* Deep Key Extraction */

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Paths<T> = ValidateTranslations extends never
  ? never
  : T extends object
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends object
            ? K | Join<K, Paths<T[K]>>
            : K
          : never;
      }[keyof T]
    : never;

export type TranslationKeys = Paths<DefaultSchema>;

/* Deep Object Mapping (Dot Access) */

type DeepObject<T> = {
  [K in keyof T]: T[K] extends object ? DeepObject<T[K]> : T[K];
};

/* Typed translation shape */
export type TranslationShape = DeepObject<
  (typeof translations)[typeof defaultLang]
>;
