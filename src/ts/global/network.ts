import wretch from 'wretch';
import { siteConfig } from '@/config';

const onlineCheck = (): boolean => {
	let online = false;
	wretch(`${siteConfig.url}/online.txt`)
		.get()
		.notFound((error) => {
			console.log(`Error conneting to online: ${error.message}`);
		})
		.json((r) => {
			if (r.online != undefined || r.online != null) online = true;
		});

	return online;
};

export const isOnline = (): boolean => {
    if (window.navigator.onLine || onlineCheck()) {
		return true;
	} else {
		return false;
	}
};
