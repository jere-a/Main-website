import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface Props {
	id: string,
	title?: string
}

const YTLite: React.FC<Props> = ({ id, title = "YouTube Embed" }) => (
	<div>
		<LiteYouTubeEmbed
			id={id}
			adNetwork={false}
			params=""
			playlist={false}
			playlistCoverId={id}
			poster="hqdefault"
			title={title}
			noCookie={true}
		/>
	</div>
);

export default YTLite;