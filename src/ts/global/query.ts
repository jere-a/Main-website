export const query = (query: string, context: HTMLElement | Document = document): HTMLElement => {
		return context.querySelector(query) as HTMLElement;
};

export const queryAll = (
	query: string,
	context: HTMLElement | Document = document
): NodeListOf<Element> => {
	return context.querySelectorAll(query);
};

export const queryAll_v2 = (
	query: string,
	context: HTMLElement | Document = document
): NodeListOf<HTMLElement> => {
	return context.querySelectorAll<HTMLElement>(query);
};
