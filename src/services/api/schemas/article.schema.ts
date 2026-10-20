import { z } from "zod";

/**
 * Schema for a single article from the API
 */
export const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  publishedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Schema for the list of articles response from the API
 */
export const articlesResponseSchema = z.object({
  articles: z.array(articleSchema),
});

/**
 * Inferred TypeScript types from Zod schemas
 */
export type Article = z.infer<typeof articleSchema>;
export type ArticlesResponse = z.infer<typeof articlesResponseSchema>;
