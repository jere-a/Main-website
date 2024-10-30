import { atom } from 'nanostores';

export const ytlite_data = atom<{ id: string; title: string }>({
	id: 'id',
	title: 'title',
});
