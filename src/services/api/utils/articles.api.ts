import { apiClient } from "../client";
import {
  type Article,
  articlesResponseSchema,
} from "../schemas/article.schema";

export const fetchArticles = async (): Promise<Article[]> => {
  const response = await apiClient.get("/api/v1/articles");

  const validatedData = articlesResponseSchema.parse(response.data);

  return validatedData.articles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
