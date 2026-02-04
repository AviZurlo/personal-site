import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()),
    source: z.enum(['mirror', 'x', 'original']),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  articles,
};
