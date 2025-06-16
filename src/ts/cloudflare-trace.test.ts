import { expect, test } from 'vitest';
import { siteConfig } from '@/config.ts';
import { fetchData } from './cloudflare-trace.ts';
import { z } from 'zod/v4';

test('cloudflare-trace', async () => {
  const returned = await fetchData().then(data => {
    return data;
  })

  expect(returned.ip).toBe(await fetch('https://ifconfig.me/ip').then(async ip => {
    return z.ipv4().parse((await ip.text()));
  }));
  expect(returned.tls).toBeOneOf(['TLSv1.3', 'TLSv1.2', 'TLSv1.1']);
  expect(returned.h).toBe(siteConfig.host);
})
