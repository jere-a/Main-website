import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { ytlite_data } from '@/ts/stores';

interface Props {
	id?: string;
	title?: string;
}

const YTLite: React.FC<Props> = ({ id, title = 'YouTube Embed' }) => {
	const $ytlite_data = useStore(ytlite_data);
	const [data, setData] = useState<{
		id?: string;
		title?: string;
	}>();

	useEffect(() => {
		if (title != 'Youtube Embed' && title != undefined) setData({ title: title });
		else setData({ title: $ytlite_data.title });

		if (id != undefined) setData({ id: id });
		else setData({ id: $ytlite_data.id });

		ytlite_data.listen((data) => {
			setData(data);
		});
	}, []);

	const VideoIdCheck = () => {
		if (data != undefined && typeof data.id === 'string') return data.id;
		else return 'id';
	};

	return (
		<LiteYouTubeEmbed
			id={VideoIdCheck()}
			adNetwork={false}
			params=""
			playlist={false}
			playlistCoverId={VideoIdCheck()}
			poster="hqdefault"
			title={(function () {
				if (data != undefined && typeof data.title === 'string') return data.title;
				else return 'title';
			})()}
			noCookie={true}
		/>
	);
};

export default YTLite;
