import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Article } from "../../../services/api";
import * as articlesApi from "../../../services/api/utils/articles.api";
import { useArticles } from "./useArticles";

vi.mock("../../../services/api/utils/articles.api");

describe("useArticles", () => {
  const mockArticles: Article[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "First Article",
      content: "Content 1",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z",
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174002",
      title: "Second Article",
      content: "Content 2",
      createdAt: "2024-01-14T09:00:00.000Z",
      updatedAt: "2024-01-14T09:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Given useArticles hook", () => {
    describe("when hook is mounted", () => {
      it("then starts in loading state", () => {
        vi.spyOn(articlesApi, "fetchArticles").mockImplementation(
          () => new Promise(() => {}),
        );

        const { result } = renderHook(() => useArticles());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.articles).toEqual([]);
        expect(result.current.error).toBeNull();
      });
    });

    describe("when API returns articles successfully", () => {
      it("then sets articles and clears loading state", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockResolvedValue(mockArticles);

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.articles).toEqual(mockArticles);
        expect(result.current.error).toBeNull();
      });

      it("then fetches articles on mount", async () => {
        const fetchSpy = vi
          .spyOn(articlesApi, "fetchArticles")
          .mockResolvedValue(mockArticles);

        renderHook(() => useArticles());

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when API returns empty array", () => {
      it("then sets empty articles array", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockResolvedValue([]);

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.articles).toEqual([]);
        expect(result.current.error).toBeNull();
      });
    });

    describe("when API call fails", () => {
      it("then sets error and clears loading state", async () => {
        const mockError = new Error("Network error");
        vi.spyOn(articlesApi, "fetchArticles").mockRejectedValue(mockError);

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toEqual(mockError);
        expect(result.current.articles).toEqual([]);
      });

      it("then wraps non-Error objects in Error", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockRejectedValue(
          "String error",
        );

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe("Failed to fetch articles");
      });
    });

    describe("when retry is called", () => {
      it("then fetches articles again", async () => {
        const fetchSpy = vi
          .spyOn(articlesApi, "fetchArticles")
          .mockResolvedValue(mockArticles);

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        act(() => {
          result.current.retry();
        });

        await waitFor(() => {
          expect(fetchSpy).toHaveBeenCalledTimes(2);
        });
      });

      it("then clears previous error", async () => {
        const mockError = new Error("Network error");
        vi.spyOn(articlesApi, "fetchArticles")
          .mockRejectedValueOnce(mockError)
          .mockResolvedValueOnce(mockArticles);

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.error).toEqual(mockError);
        });

        act(() => {
          result.current.retry();
        });

        await waitFor(() => {
          expect(result.current.error).toBeNull();
          expect(result.current.articles).toEqual(mockArticles);
        });
      });

      it("then sets loading state during retry", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockResolvedValue(mockArticles);

        const { result } = renderHook(() => useArticles());

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        act(() => {
          result.current.retry();
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });
      });
    });

    describe("when component unmounts before fetch completes", () => {
      it("then does not update state", async () => {
        vi.spyOn(articlesApi, "fetchArticles").mockImplementation(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(mockArticles), 100);
            }),
        );

        const { result, unmount } = renderHook(() => useArticles());

        expect(result.current.isLoading).toBe(true);

        unmount();

        await new Promise((resolve) => setTimeout(resolve, 150));
      });
    });
  });
});
