import { apiClient } from "../client";
import {
  articlesResponseSchema,
  type Article,
} from "../schemas/article.schema";

export const fetchArticles = async (): Promise<Article[]> => {
  const response = await apiClient.get("/api/v1/articles");

  console.log("Raw API response data:", response.data);

  try {
    const validatedData = articlesResponseSchema.parse(response.data);
    console.log("Validated data:", validatedData);

    return validatedData.articles.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
};
