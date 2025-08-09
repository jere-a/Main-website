export const query = (
  query: string,
  context: HTMLElement | Document = document,
): HTMLElement => context.querySelector(query) as HTMLElement;

export const queryAll = (
  query: string,
  context: HTMLElement | Document = document,
): NodeListOf<Element> => context.querySelectorAll(query);

export const queryAll_v2 = (
  query: string,
  context: HTMLElement | Document = document,
): NodeListOf<HTMLElement> => context.querySelectorAll<HTMLElement>(query);
