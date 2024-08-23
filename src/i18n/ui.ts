export const languages = {
	fi: 'Suomi',
	en: 'English',
};

export const defaultLang = 'fi';

export const ui = {
	fi: {
		'nav.home': 'Koti',
		'nav.about': 'Tietoja',
		'nav.images': 'K\u00E4y katsomassa minun ottamiani kuvia.',
		'nav.oldsite':
			'K\u00E4y katsomassa mit\u00E4 olen tehnyt toisen sivun nettiin (Sit\u00E4 ei taida tulla en\u00E4\u00E4n p\u00E4ivitt\u00E4m\u00E4\u00E4n)',
		'index.h1.title': '\u00C5zze Nettisivu',
	},
	en: {
		'nav.home': 'Home',
		'nav.about': 'About',
		'nav.images': 'Come to see what images i have taken.',
		'nav.oldsite': '',
		'index.h1.title': '&#xC5;zze Website',
	},
} as const;

export const showDefaultLang = false;