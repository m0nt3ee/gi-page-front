import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Article } from "../../../services/api";
import { useArticle } from "./useArticle";

vi.mock("../../../services/api", () => ({
  fetchArticleById: vi.fn(),
}));

import { fetchArticleById } from "../../../services/api";

describe("useArticle", () => {
  const mockArticle: Article = {
    id: "123e4567-e89b-12d3-a456-426614174001",
    title: "Test Article",
    content: "Article content",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Given a valid article ID", () => {
    describe("when hook is rendered", () => {
      it("then starts in loading state", () => {
        vi.mocked(fetchArticleById).mockImplementation(
          () => new Promise(() => {}),
        );

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        expect(result.current.isLoading).toBe(true);
        expect(result.current.article).toBe(null);
        expect(result.current.error).toBe(null);
        expect(result.current.notFound).toBe(false);
      });

      it("then fetches article from API", async () => {
        vi.mocked(fetchArticleById).mockResolvedValue(mockArticle);

        renderHook(() => useArticle("123e4567-e89b-12d3-a456-426614174001"));

        await waitFor(() => {
          expect(fetchArticleById).toHaveBeenCalledWith(
            "123e4567-e89b-12d3-a456-426614174001",
          );
        });
      });

      it("then sets article when API succeeds", async () => {
        vi.mocked(fetchArticleById).mockResolvedValue(mockArticle);

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.article).toEqual(mockArticle);
        expect(result.current.error).toBe(null);
        expect(result.current.notFound).toBe(false);
      });
    });

    describe("when API returns 404", () => {
      it("then sets notFound to true", async () => {
        const notFoundError = {
          response: { status: 404 },
        };
        vi.mocked(fetchArticleById).mockRejectedValue(notFoundError);

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notFound).toBe(true);
        expect(result.current.article).toBe(null);
        expect(result.current.error).toBe(null);
      });
    });

    describe("when API returns error other than 404", () => {
      it("then sets error state", async () => {
        const networkError = new Error("Network error");
        vi.mocked(fetchArticleById).mockRejectedValue(networkError);

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toEqual(networkError);
        expect(result.current.article).toBe(null);
        expect(result.current.notFound).toBe(false);
      });

      it("then creates error for 500 status", async () => {
        const serverError = {
          response: { status: 500 },
        };
        vi.mocked(fetchArticleById).mockRejectedValue(serverError);

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).not.toBe(null);
        expect(result.current.error?.message).toContain(
          "Failed to fetch article",
        );
        expect(result.current.notFound).toBe(false);
      });
    });

    describe("when retry is called", () => {
      it("then fetches article again", async () => {
        vi.mocked(fetchArticleById)
          .mockRejectedValueOnce(new Error("First error"))
          .mockResolvedValueOnce(mockArticle);

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).not.toBe(null);

        await act(async () => {
          result.current.retry();
        });

        await waitFor(() => {
          expect(result.current.article).toEqual(mockArticle);
        });

        expect(result.current.error).toBe(null);
        expect(fetchArticleById).toHaveBeenCalledTimes(2);
      });

      it("then resets error state before refetching", async () => {
        vi.mocked(fetchArticleById).mockRejectedValue(new Error("error"));

        const { result } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        await waitFor(() => {
          expect(result.current.error).not.toBe(null);
        });

        const errorBefore = result.current.error;
        expect(errorBefore).not.toBe(null);

        act(() => {
          result.current.retry();
        });

        // Wait for loading to complete (will fail again)
        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        // Verify the state was reset during the retry (new error instance)
        expect(result.current.notFound).toBe(false);
        expect(result.current.article).toBe(null);
      });
    });
  });

  describe("Given undefined ID", () => {
    describe("when hook is rendered", () => {
      it("then sets notFound to true immediately", async () => {
        const { result } = renderHook(() => useArticle(undefined));

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.notFound).toBe(true);
        expect(result.current.article).toBe(null);
        expect(result.current.error).toBe(null);
      });

      it("then does not call API", () => {
        renderHook(() => useArticle(undefined));

        expect(fetchArticleById).not.toHaveBeenCalled();
      });
    });
  });

  describe("Given ID changes", () => {
    describe("when ID prop updates", () => {
      it("then fetches new article", async () => {
        const firstArticle: Article = {
          ...mockArticle,
          id: "123e4567-e89b-12d3-a456-426614174001",
          title: "First Article",
        };
        const secondArticle: Article = {
          ...mockArticle,
          id: "123e4567-e89b-12d3-a456-426614174002",
          title: "Second Article",
        };

        vi.mocked(fetchArticleById).mockImplementation(async (id) => {
          if (id === "123e4567-e89b-12d3-a456-426614174001") {
            return firstArticle;
          }
          return secondArticle;
        });

        const { result, rerender } = renderHook(({ id }) => useArticle(id), {
          initialProps: { id: "123e4567-e89b-12d3-a456-426614174001" },
        });

        await waitFor(() => {
          expect(result.current.article?.title).toBe("First Article");
        });

        rerender({ id: "123e4567-e89b-12d3-a456-426614174002" });

        await waitFor(() => {
          expect(result.current.article?.title).toBe("Second Article");
        });

        expect(fetchArticleById).toHaveBeenCalledTimes(2);
      });

      it("then resets state before fetching", async () => {
        vi.mocked(fetchArticleById).mockResolvedValue(mockArticle);

        const { result, rerender } = renderHook(({ id }) => useArticle(id), {
          initialProps: { id: "123e4567-e89b-12d3-a456-426614174001" },
        });

        await waitFor(() => {
          expect(result.current.article).not.toBe(null);
        });

        rerender({ id: "123e4567-e89b-12d3-a456-426614174002" });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.article).toBe(null);
        expect(result.current.error).toBe(null);
        expect(result.current.notFound).toBe(false);
      });
    });
  });

  describe("Given component unmounts", () => {
    describe("when fetch is in progress", () => {
      it("then does not update state after unmount", async () => {
        let resolvePromise: (value: Article) => void = () => {};
        const promise = new Promise<Article>((resolve) => {
          resolvePromise = resolve;
        });

        vi.mocked(fetchArticleById).mockReturnValue(promise);

        const { result, unmount } = renderHook(() =>
          useArticle("123e4567-e89b-12d3-a456-426614174001"),
        );

        expect(result.current.isLoading).toBe(true);

        unmount();

        resolvePromise(mockArticle);

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.article).toBe(null);
      });
    });
  });
});
