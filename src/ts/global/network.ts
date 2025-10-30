import { siteConfig } from "@/config";
import { l } from "@/ts/global";

const onlineCheck = async (): Promise<boolean> => {
  const onlineCheckStatus = async () => {
    new Promise<boolean>((resolve) => {
      fetch(`${siteConfig.url}/online.txt`)
        .then((response) => {
          if (!response.ok) {
            l(
              `Error connecting to online: ${response.status} ${response.statusText}`,
            );
            return false;
          }
          return response.json();
        })
        .then((jsonResponse) => {
          if (
            jsonResponse.online !== undefined &&
            jsonResponse.online !== null
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          l(`Error connecting to online: ${error.message}`);
          resolve(false);
        });
    });
  };
  const resolve = await new Promise<boolean>(() => {
    onlineCheckStatus().then((e) => {
      return e;
    });
  });

  return resolve;
};

export const isOnline = async (): Promise<boolean> => {
  return window.navigator.onLine || (await onlineCheck());
};
