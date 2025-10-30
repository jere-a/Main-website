import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
  title: z.string(),
  pubDate: z.date(),
  tags: z.array(z.string()).optional(),
  lang: z.enum(["fi", "en"]).optional(),
  draft: z.boolean().optional(),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: schema,
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
};
