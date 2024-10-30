import { defineCollection, z } from 'astro:content';


// 2. Define a `type` and `schema` for each collection
const blogCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	/* schema: rssSchema, */
	schema: z.object({
		title: z.string(),
		pubDate: z.date(),
		tags: z.array(z.string()).optional(),
		lang: z.enum(['fi', 'en']).optional(),
		isDraft: z.boolean().optional(),
	}),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
};
