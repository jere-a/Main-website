import { l } from '@/ts/global';
import '@/styles/holidays/halloween.css';


const queryAll = (q: string, c = document) => c.querySelectorAll(q);

export const main_halloween = () => {
  document.querySelectorAll('p').forEach((e) => {
			if (typeof e !== 'string') {
				e.classList.add('halloween');
					if (e.classList.contains('halloween-time')) {
						e.classList.add('butcherman');
					}
			} else {
				const elementsToModify = queryAll(e);
				elementsToModify.forEach((element) => element.classList.add('halloween'));
			}
		});
		if (!main_halloween.once) {
				l('Halloween 👻');
				main_halloween.once = true;
		}
	}



main_halloween.once = false;
