import { z } from "zod";

export const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  publishedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const articlesResponseSchema = z.object({
  articles: z.array(articleSchema),
});

export type Article = z.infer<typeof articleSchema>;
export type ArticlesResponse = z.infer<typeof articlesResponseSchema>;
