import { siteConfig } from '@/config';
import { l } from '@/ts/global';

export const latestVideo = async () => {
	const channelURL = encodeURIComponent(
		`https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.yt_cid}`
	);
	const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${channelURL}`;

	const reqRes = await fetch(reqURL)
		.then(response => response.json())
		.catch((error: string) => l('error', error));

	const link: string = reqRes.items[0].link;
	const title: string = reqRes.items[0].title;
	const id: string = link.substring(link.indexOf('=') + 1);

	return {
		id: id,
		title: title,
	};
};
