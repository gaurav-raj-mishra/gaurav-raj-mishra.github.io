import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * The blog. Every markdown file in src/content/blog/ becomes a post.
 * Required frontmatter: title, date. Everything else is optional.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // One-line summary shown on the blog index and in link previews.
    description: z.string().optional(),
    // Freeform tags — used for filtering on the blog index.
    tags: z.array(z.string()).default([]),
    // Set true to hide a post while you're still writing it.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
