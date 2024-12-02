import { l } from '@/ts/global';

export const christmas = async function() {
  new (await import('let-it-go/src')).default()
    
  if (!!christmas.once) {
    l('Christmas');
    christmas.once = true;
  }
};

christmas.once = false;