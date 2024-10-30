import { queryAll } from '@/ts/global';

let halloween_once = false;

export const main_halloween = (elements: (HTMLElement | string)[] | string[] | undefined) => {
	if (elements !== undefined) {
		elements.forEach((e) => {
			if (typeof e != 'string') {
				e.classList.add('halloween');
				if (e.classList.contains('halloween-time')) {
					e.classList.add('butcherman');
				}
			} else {
				queryAll(e).forEach((e) => {
					e.classList.add('halloween');
				});
			}
		});
	}

	if (!halloween_once) {
		console.log('Halloween 👻');
		halloween_once = true;
	}
};
