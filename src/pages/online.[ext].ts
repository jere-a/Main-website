import type { APIRoute } from 'astro';
import { siteConfig } from '@/config';

export const GET: APIRoute = ({ params, request }) => {
	const ext = params.ext;
	if (ext != undefined && ext === 'json') {
		return new Response(
			JSON.stringify({
				online: true,
				path: request.url,
				url: siteConfig.url,
				oldSite: siteConfig.oldSite,
				mainLanguage: siteConfig.mainLanguage,
			}),
			{
				status: 200,
			}
		);
	}

	if (ext != undefined && ext === 'txt') {
		return new Response('online', {
			status: 200,
		});
    }
    return new Response('');
};

export function getStaticPaths() {
	return [{ params: { ext: 'json' } }, { params: { ext: 'txt' } }];
}
