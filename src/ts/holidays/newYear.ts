import { Fireworks } from 'fireworks-js';
import { query } from '../global';

import exp0 from '@/data/sounds/explosion0.opus';
import exp1 from '@/data/sounds/explosion1.opus';
import exp2 from '@/data/sounds/explosion2.opus';

export const NewYear = async () => {
  if (!NewYear.once) {
    NewYear.once = true;
    const fireworksContainer = Object.assign(document.createElement('div'), {
      className: 'fireworks-container',
      style: 'position: absolute; top: 0px; left: 0px; z-index: -2; pointer-events: none; width: 100%; height: 100%; overflow: hidden;'
    });
    document.body?.appendChild(fireworksContainer) || console.error('Document body is not ready.');
    
    const fireworksCon = query('.fireworks-container');
    const fireworks = new Fireworks(fireworksCon, {
      boundaries: {
        x: 50,
        y: 50,
        width: fireworksCon.clientWidth,
        height: fireworksCon.clientHeight
      },
      sound: {
        enabled: true,
        files: [
          exp0,
          exp1,
          exp2
        ],
      }
    });
    fireworks.start();
  }
};

NewYear.once = false;