import { siteConfig } from '@/config';
import { addGlobalEventListener } from '@/ts/global';

const main = () => {
  if (siteConfig.params.functions.quicklink) {
    import('quicklink').then(({ listen }) => {
      listen({ prerender: true });
    });
  }
  
  function handleMouseDown(event: Event) {
    if (event.currentTarget instanceof HTMLAnchorElement && event.currentTarget.href) {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }
  
  ['mousedown', 'touchstart', 'pointerdown'].forEach((action) => {
    addGlobalEventListener(action, 'a', handleMouseDown);
  });
};

export default main;