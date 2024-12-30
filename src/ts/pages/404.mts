import { fetchData } from '@/ts/cloudflare-trace';
import { query } from '@/ts/global';

const data = await fetchData().then(a => a);
const { pathname, search } = window.location;
const notshow = ['404', '404.html', '404.htm', '404/index.html', '404/index.htm'];

if (!notshow.includes(pathname)) {
	query('.NotFound').innerText = `Sivuun ${pathname}${search} ei saatu yhteyttä.`;
} else {
	query('.NotFound').innerText =
		`Sivu jota yrität käyttää on tarkoitettu näytettäväksi jos etsimääsi sivua ei löydy.`;
}
query('.info').innerText = `Yhteyttä yrittänyt ip osoite: ${data.ip}\nUserAgent: ${data.uag}`;