import { describe, expect, it } from "vitest";
import { articleSchema, articlesResponseSchema } from "./article.schema";

describe("article.schema", () => {
  describe("Given articleSchema", () => {
    describe("when validating a valid article", () => {
      it("then parses successfully", () => {
        const validArticle = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Test Article",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(validArticle);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validArticle);
        }
      });
    });

    describe("when validating article with missing fields", () => {
      it("then fails for missing id", () => {
        const invalidArticle = {
          title: "Test Article",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(invalidArticle);

        expect(result.success).toBe(false);
      });

      it("then fails for missing title", () => {
        const invalidArticle = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(invalidArticle);

        expect(result.success).toBe(false);
      });

      it("then fails for missing content", () => {
        const invalidArticle = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Test Article",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(invalidArticle);

        expect(result.success).toBe(false);
      });
    });

    describe("when validating article with invalid types", () => {
      it("then fails for non-UUID id", () => {
        const invalidArticle = {
          id: "not-a-uuid",
          title: "Test Article",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(invalidArticle);

        expect(result.success).toBe(false);
      });

      it("then fails for empty title", () => {
        const invalidArticle = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(invalidArticle);

        expect(result.success).toBe(false);
      });

      it("then fails for invalid date format", () => {
        const invalidArticle = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Test Article",
          content: "Article content",
          createdAt: "not-a-date",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const result = articleSchema.safeParse(invalidArticle);

        expect(result.success).toBe(false);
      });
    });

    describe("when validating article with extra fields", () => {
      it("then strips extra fields", () => {
        const articleWithExtra = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Test Article",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
          extraField: "should be stripped",
        };

        const result = articleSchema.parse(articleWithExtra);

        expect(result).not.toHaveProperty("extraField");
      });
    });
  });

  describe("Given articlesResponseSchema", () => {
    describe("when validating valid articles array", () => {
      it("then parses successfully", () => {
        const validResponse = {
          articles: [
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
          ],
        };

        const result = articlesResponseSchema.safeParse(validResponse);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.articles).toHaveLength(2);
        }
      });

      it("then accepts empty array", () => {
        const result = articlesResponseSchema.safeParse({ articles: [] });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.articles).toEqual([]);
        }
      });
    });

    describe("when validating invalid articles array", () => {
      it("then fails for non-array input", () => {
        const result = articlesResponseSchema.safeParse("not an array");

        expect(result.success).toBe(false);
      });

      it("then fails if any article is invalid", () => {
        const invalidResponse = {
          articles: [
            {
              id: "123e4567-e89b-12d3-a456-426614174001",
              title: "Article 1",
              content: "Content 1",
              createdAt: "2024-01-15T10:30:00.000Z",
              updatedAt: "2024-01-15T10:30:00.000Z",
            },
            {
              id: "not-a-uuid",
              title: "Article 2",
              content: "Content 2",
              createdAt: "2024-01-14T09:00:00.000Z",
              updatedAt: "2024-01-14T09:00:00.000Z",
            },
          ],
        };

        const result = articlesResponseSchema.safeParse(invalidResponse);

        expect(result.success).toBe(false);
      });
    });
  });

  describe("Given inferred types", () => {
    describe("when using Article type", () => {
      it("then has correct structure", () => {
        const article = {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Test Article",
          content: "Article content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        const parsed = articleSchema.parse(article);

        expect(parsed.id).toBe(article.id);
        expect(parsed.title).toBe(article.title);
        expect(parsed.content).toBe(article.content);
        expect(parsed.createdAt).toBe(article.createdAt);
        expect(parsed.updatedAt).toBe(article.updatedAt);
      });
    });
  });
});
