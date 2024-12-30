import { ui, defaultLang, showDefaultLang } from './ui';

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

export function useTranslations(lang: string) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
	  const validLang = (lang in ui ? lang : defaultLang) as keyof typeof ui;
	  return ui[validLang][key] || ui[defaultLang][key];
	};
}

export function useTranslatedPath(lang: string) {
	return function translatePath(path: string, l: string = lang) {
	  const validLang = (lang in ui ? lang : defaultLang) as keyof typeof ui;
		return !showDefaultLang && l === defaultLang ? path : `/${validLang}${path}`;
	};
}

export function iterator(data: any) {
  const iterator: any = {};
  iterator[Symbol.iterator] = function* () {
    yield data;
  };
  return [...iterator];
}