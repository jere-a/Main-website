import { siteConfig } from '@/config';
import wretch from 'wretch';

export const latestVideo = async () => {
	const channelURL = encodeURIComponent(
		`https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.yt_cid}`
	);
	const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`;

	const reqRes = await wretch(reqURL)
		.get()
		.json((json: any) => {
			return json;
		})
		.catch((error: string) => console.log('error', error));

	const link: string = reqRes.items[0].link;
	const title: string = reqRes.items[0].title;
	const id: string = link.substring(link.indexOf('=') + 1);

	return {
		id: id,
		title: title,
	};
};
