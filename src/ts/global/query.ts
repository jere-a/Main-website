/**
 * @description This is propably easier way to use querySelector in typescript without having to set the type every time does not work in all cases
 * @param query - Query selector (String)
 * @param context - HTMLElement or document (HTMLElement | Document)
 * @returns Query selector as type for HTMLElement | null
 */
export const query = (
  query: string,
  context: HTMLElement | Document = document,
): HTMLElement | null => context.querySelector(query);

/**
 * @description Query selector returning all matching elements
 * @param query - Query selector (String)
 * @param context - HTMLElement or document (HTMLElement | Document)
 * @returns NodeListOf<Element>
 */
export const queryAll = (
  query: string,
  context: HTMLElement | Document = document,
): NodeListOf<Element> => context.querySelectorAll(query);

/**
 * @description Query selector returning all matching elements as HTMLElements
 * @param query - Query selector (String)
 * @param context - HTMLElement or document (HTMLElement | Document)
 * @returns NodeListOf<HTMLElement>
 */
export const queryAll_v2 = (
  query: string,
  context: HTMLElement | Document = document,
): NodeListOf<HTMLElement> => context.querySelectorAll<HTMLElement>(query);
