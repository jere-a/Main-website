import LetItGo from 'let-it-go/src';
import { l } from '@/ts/global';
import '@/styles/holidays/christmas.css';

export const christmas = async function() {
  if (!christmas.once) {
    christmas.once = true;
    new LetItGo();
    
    const lightrope = document.createElement('ul');
    lightrope.className = 'lightrope';
    for (let i = 0; i < 42; i++) {
      const listItem = document.createElement('li');
      lightrope.appendChild(listItem);
    }
    document.body?.insertBefore(lightrope, document.body.firstChild) || console.error('Document body is not ready.');
    
    l('Christmas');
  }
};

christmas.once = false;