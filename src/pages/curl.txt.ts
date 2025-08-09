import type { APIRoute } from "astro";

const raw = `
Oh you did find my secret hideout for stone age humans. What did you expect here to be a monologue of the biggest stone in exitence or are you just predenting to be script kiddie trying to hack my website just like that or perhaps AI scraping machine all over my websites.

Where are you heading with this 
`;

export const GET: APIRoute = () => {
  return new Response(raw);
};
