import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import type { Article } from "../schemas/article.schema";
import { fetchArticleById, fetchArticles } from "./articles.api";

vi.mock("../client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { apiClient } from "../client";

describe("articles.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Given fetchArticles function", () => {
    describe("when API returns valid articles", () => {
      it("then returns parsed articles", async () => {
        const mockArticles: Article[] = [
          {
            id: "123e4567-e89b-12d3-a456-426614174001",
            title: "Article 1",
            content: "Content 1",
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2024-01-15T10:30:00.000Z",
          },
          {
            id: "123e4567-e89b-12d3-a456-426614174002",
            title: "Article 2",
            content: "Content 2",
            createdAt: "2024-01-14T09:00:00.000Z",
            updatedAt: "2024-01-14T09:00:00.000Z",
          },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
          data: { articles: mockArticles },
        });

        const result = await fetchArticles();

        expect(apiClient.get).toHaveBeenCalledWith("/api/v1/articles");
        expect(result).toEqual(mockArticles);
      });

      it("then sorts articles by date newest first", async () => {
        const mockArticles: Article[] = [
          {
            id: "123e4567-e89b-12d3-a456-426614174001",
            title: "Older Article",
            content: "Content 1",
            createdAt: "2024-01-10T10:30:00.000Z",
            updatedAt: "2024-01-10T10:30:00.000Z",
          },
          {
            id: "123e4567-e89b-12d3-a456-426614174002",
            title: "Newer Article",
            content: "Content 2",
            createdAt: "2024-01-20T09:00:00.000Z",
            updatedAt: "2024-01-20T09:00:00.000Z",
          },
          {
            id: "123e4567-e89b-12d3-a456-426614174003",
            title: "Middle Article",
            content: "Content 3",
            createdAt: "2024-01-15T12:00:00.000Z",
            updatedAt: "2024-01-15T12:00:00.000Z",
          },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
          data: { articles: mockArticles },
        });

        const result = await fetchArticles();

        expect(result[0].title).toBe("Newer Article");
        expect(result[1].title).toBe("Middle Article");
        expect(result[2].title).toBe("Older Article");
      });
    });

    describe("when API returns empty array", () => {
      it("then returns empty array", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { articles: [] } });

        const result = await fetchArticles();

        expect(result).toEqual([]);
      });
    });

    describe("when API returns invalid data", () => {
      it("then throws ZodError for missing fields", async () => {
        const invalidData = [
          {
            id: "123e4567-e89b-12d3-a456-426614174001",
            title: "Article without content",
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2024-01-15T10:30:00.000Z",
          },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
          data: { articles: invalidData },
        });

        await expect(fetchArticles()).rejects.toThrow(ZodError);
      });

      it("then throws ZodError for invalid UUID", async () => {
        const invalidData = [
          {
            id: "not-a-uuid",
            title: "Invalid Article",
            content: "Content",
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2024-01-15T10:30:00.000Z",
          },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
          data: { articles: invalidData },
        });

        await expect(fetchArticles()).rejects.toThrow(ZodError);
      });

      it("then throws ZodError for invalid date", async () => {
        const invalidData = [
          {
            id: "123e4567-e89b-12d3-a456-426614174001",
            title: "Article",
            content: "Content",
            createdAt: "not-a-date",
            updatedAt: "2024-01-15T10:30:00.000Z",
          },
        ];

        vi.mocked(apiClient.get).mockResolvedValue({
          data: { articles: invalidData },
        });

        await expect(fetchArticles()).rejects.toThrow(ZodError);
      });

      it("then throws ZodError for non-array response", async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: "not an array" });

        await expect(fetchArticles()).rejects.toThrow(ZodError);
      });
    });

    describe("when API call fails", () => {
      it("then throws network error", async () => {
        const networkError = new Error("Network error");
        vi.mocked(apiClient.get).mockRejectedValue(networkError);

        await expect(fetchArticles()).rejects.toThrow("Network error");
      });

      it("then throws error for 404", async () => {
        const error = {
          response: {
            status: 404,
            data: "Not found",
          },
        };
        vi.mocked(apiClient.get).mockRejectedValue(error);

        await expect(fetchArticles()).rejects.toThrow();
      });

      it("then throws error for 500", async () => {
        const error = {
          response: {
            status: 500,
            data: "Internal server error",
          },
        };
        vi.mocked(apiClient.get).mockRejectedValue(error);

        await expect(fetchArticles()).rejects.toThrow();
      });
    });
  });

  describe("Given fetchArticleById function", () => {
    describe("when API returns valid article", () => {
      it("then returns parsed article", async () => {
        const mockArticle: Article = {
          id: "123e4567-e89b-12d3-a456-426614174001",
          title: "Test Article",
          content: "Full article content with multiple paragraphs.",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        vi.mocked(apiClient.get).mockResolvedValue({
          data: mockArticle,
        });

        const result = await fetchArticleById(
          "123e4567-e89b-12d3-a456-426614174001",
        );

        expect(apiClient.get).toHaveBeenCalledWith(
          "/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
        );
        expect(result).toEqual(mockArticle);
      });
    });

    describe("when API returns invalid data", () => {
      it("then throws ZodError for missing fields", async () => {
        const invalidData = {
          id: "123e4567-e89b-12d3-a456-426614174001",
          title: "Article without content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        vi.mocked(apiClient.get).mockResolvedValue({
          data: invalidData,
        });

        await expect(
          fetchArticleById("123e4567-e89b-12d3-a456-426614174001"),
        ).rejects.toThrow(ZodError);
      });

      it("then throws ZodError for invalid UUID", async () => {
        const invalidData = {
          id: "not-a-uuid",
          title: "Invalid Article",
          content: "Content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        vi.mocked(apiClient.get).mockResolvedValue({
          data: invalidData,
        });

        await expect(fetchArticleById("not-a-uuid")).rejects.toThrow(ZodError);
      });

      it("then throws ZodError for invalid date", async () => {
        const invalidData = {
          id: "123e4567-e89b-12d3-a456-426614174001",
          title: "Article",
          content: "Content",
          createdAt: "not-a-date",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        vi.mocked(apiClient.get).mockResolvedValue({
          data: invalidData,
        });

        await expect(
          fetchArticleById("123e4567-e89b-12d3-a456-426614174001"),
        ).rejects.toThrow(ZodError);
      });
    });

    describe("when API call fails", () => {
      it("then throws network error", async () => {
        const networkError = new Error("Network error");
        vi.mocked(apiClient.get).mockRejectedValue(networkError);

        await expect(
          fetchArticleById("123e4567-e89b-12d3-a456-426614174001"),
        ).rejects.toThrow("Network error");
      });

      it("then throws error for 404 not found", async () => {
        const error = {
          response: {
            status: 404,
            data: "Not found",
          },
        };
        vi.mocked(apiClient.get).mockRejectedValue(error);

        await expect(
          fetchArticleById("123e4567-e89b-12d3-a456-426614174001"),
        ).rejects.toThrow();
      });

      it("then throws error for 500", async () => {
        const error = {
          response: {
            status: 500,
            data: "Internal server error",
          },
        };
        vi.mocked(apiClient.get).mockRejectedValue(error);

        await expect(
          fetchArticleById("123e4567-e89b-12d3-a456-426614174001"),
        ).rejects.toThrow();
      });
    });
  });
});
