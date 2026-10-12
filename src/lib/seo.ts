/**
 * SEO helpers: Open Graph locale mapping and schema.org JSON-LD builders.
 *
 * Kept free of Astro/site imports so the builders stay pure and easy to test; callers supply the
 * site metadata.
 */

/** Open Graph locales (`language_TERRITORY`) for each supported site language. */
const OG_LOCALES: Record<string, string> = {
  fi: "fi_FI",
  en: "en_US",
};

const FALLBACK_OG_LOCALE = "fi_FI";

/** The Open Graph locale for a language, falling back to the default locale. */
export const getOgLocale = (lang: string): string => OG_LOCALES[lang] ?? FALLBACK_OG_LOCALE;

/** All other Open Graph locales, for `og:locale:alternate` tags. */
export const getAlternateOgLocales = (lang: string): string[] =>
  Object.entries(OG_LOCALES)
    .filter(([code]) => code !== lang)
    .map(([, locale]) => locale);

/** Escape a value so it can be embedded safely inside a `<script>` element. */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replaceAll("<", "\\u003c");

export interface WebsiteJsonLdInput {
  url: string;
  name: string;
  description: string;
  lang: string;
  author: string;
}

export const websiteJsonLd = ({ url, name, description, lang, author }: WebsiteJsonLdInput) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name,
  url,
  description,
  inLanguage: lang,
  author: { "@type": "Person", name: author },
});

export interface ArticleJsonLdInput {
  url: string;
  headline: string;
  lang: string;
  datePublished: string;
  dateModified?: string | undefined;
  author: string;
  image?: string | undefined;
}

export const articleJsonLd = (input: ArticleJsonLdInput): Record<string, unknown> => {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    inLanguage: input.lang,
    datePublished: input.datePublished,
    author: { "@type": "Person", name: input.author },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };

  if (input.dateModified) node.dateModified = input.dateModified;
  if (input.image) node.image = input.image;

  return node;
};
