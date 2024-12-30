import wretch from 'wretch';
import { l } from '@/ts/global';
import { siteConfig } from '@/config';

const onlineCheck = async (): Promise<boolean> => {
	const onlineCheckStatus = async () => {
	  new Promise<boolean>(resolve => {
   	  wretch(`${siteConfig.url}/online.txt`)
    		.get()
    		.fetchError((error) => {
     			l(`Error connecting to online: ${error.message}`);
          resolve(false);
    		})
    		.json((r) => {
     			if (r.online != undefined || r.online != null) {
              resolve(true);
          };
          resolve(false);
    		});
		})
	}
  const resolve = (await new Promise<boolean>(() => {
    onlineCheckStatus().then(e => {
      return e;
    })
  }));

  return resolve;
};

export const isOnline = async (): Promise<boolean> => {
  return window.navigator.onLine || (await onlineCheck());
};
