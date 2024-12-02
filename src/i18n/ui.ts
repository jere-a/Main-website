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
		'nav.blog': 'K\u00E4y katsomassa blogiani.',
		'nav.oldsite':
			'K\u00E4y katsomassa mit\u00E4 olen tehnyt toisen sivun nettiin (Sit\u00E4 ei taida tulla en\u00E4\u00E4n p\u00E4ivitt\u00E4m\u00E4\u00E4n)',
		'index.h1.title': '\u00C5zze',
		'holiday.christmas': 'Joulu'
	},
	en: {
		'nav.home': 'Home',
		'nav.about': 'About',
		'nav.images': 'Come to see what images i have taken.',
		'nav.blog': 'Go check out my blog.',
		'nav.oldsite':
			"Go see what I've done on the other page's website (I don't think it will be updated anymore)",
		'index.h1.title': '&#xC5;zze',
		'holiday.christmas': 'Christmas'
	},
} as const;

export const holiday = {
  fi: {
    'holiday.christmas': 'Joulu'
  },
  en: {
    'holiday.christmas': 'Christmas'
  }
}

export const showDefaultLang = false;
