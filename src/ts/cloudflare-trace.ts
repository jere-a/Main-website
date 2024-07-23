import wretch from 'wretch';
import { siteConfig } from '@/config';

export type ParsedData = {
	ip: string;
	uag: string;
	tls: string;
	loc: string;
	http: string;
	h: string;
};

export async function fetchData(): Promise<ParsedData> {
	const text = await wretch(siteConfig.url + '/cdn-cgi/trace')
		.get()
		.text();

	const lines = text.split('\n');
	const result: Partial<ParsedData> = {};

	lines.forEach((line) => {
		const [key, value] = line.split('=');
		if (key && value) {
			switch (key) {
				case 'ip':
				case 'uag':
				case 'tls':
				case 'loc':
				case 'http':
				case 'h':
					result[key as keyof ParsedData] = value;
					break;
			}
		}
	});

	// Ensure all required fields are present
	return result as ParsedData;
}


/* async function fetchData(): Promise<string> {
	const text = await wretch(siteConfig.url + '/cdn-cgi/trace')
		.get()
		.text();

	const lines = text.split('\n');
	const result: { [key: string]: string } = {};

	lines.forEach((line) => {
		const [key, value] = line.split('=');
		if (key && value) {
			switch (key) {
				case 'ip':
				case 'uag':
				case 'tls':
				case 'loc':
				case 'http':
				case 'h':
					result[key] = value;
					break;
			}
		}
	});

	return result['ip'];
} */