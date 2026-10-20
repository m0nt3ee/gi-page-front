import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Article } from "../../../services/api";
import BlogSection from "./BlogSection";
import {
  BLOG_ARTICLES_TEST_ID,
  BLOG_EMPTY_TEST_ID,
  BLOG_ERROR_TEST_ID,
  BLOG_LOADING_TEST_ID,
  BLOG_RETRY_BUTTON_TEST_ID,
  BLOG_SECTION_TEST_ID,
  EMPTY_MESSAGE,
  ERROR_MESSAGE,
  LOADING_MESSAGE,
  RETRY_BUTTON_TEXT,
} from "./BlogSection.constants";

describe("<BlogSection />", () => {
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

  describe("Given a BlogSection component", () => {
    describe("when articles are loading", () => {
      it("then displays loading spinner", () => {
        render(<BlogSection isLoading={true} />);

        const loadingElement = screen.getByTestId(BLOG_LOADING_TEST_ID);

        expect(loadingElement).toBeInTheDocument();
      });

      it("then displays loading message", () => {
        render(<BlogSection isLoading={true} />);

        expect(screen.getByText(LOADING_MESSAGE)).toBeInTheDocument();
      });

      it("then displays spinner with aria-label", () => {
        render(<BlogSection isLoading={true} />);

        const spinner = screen.getByLabelText("Loading spinner");

        expect(spinner).toBeInTheDocument();
      });

      it("then does not display articles", () => {
        render(<BlogSection isLoading={true} articles={mockArticles} />);

        expect(
          screen.queryByTestId(BLOG_ARTICLES_TEST_ID),
        ).not.toBeInTheDocument();
      });
    });

    describe("when API answers with articles", () => {
      it("then displays all articles", () => {
        render(<BlogSection articles={mockArticles} />);

        const articlesContainer = screen.getByTestId(BLOG_ARTICLES_TEST_ID);

        expect(articlesContainer).toBeInTheDocument();
        expect(screen.getByText("First Article")).toBeInTheDocument();
        expect(screen.getByText("Second Article")).toBeInTheDocument();
      });

      it("then renders correct number of articles", () => {
        render(<BlogSection articles={mockArticles} />);

        const articlesContainer = screen.getByTestId(BLOG_ARTICLES_TEST_ID);
        const articleCards = articlesContainer.querySelectorAll("article");

        expect(articleCards).toHaveLength(2);
      });

      it("then does not display loading state", () => {
        render(<BlogSection articles={mockArticles} />);

        expect(
          screen.queryByTestId(BLOG_LOADING_TEST_ID),
        ).not.toBeInTheDocument();
      });

      it("then does not display error state", () => {
        render(<BlogSection articles={mockArticles} />);

        expect(
          screen.queryByTestId(BLOG_ERROR_TEST_ID),
        ).not.toBeInTheDocument();
      });
    });

    describe("when API answers with no articles", () => {
      it("then displays empty message", () => {
        render(<BlogSection articles={[]} />);

        const emptyElement = screen.getByTestId(BLOG_EMPTY_TEST_ID);

        expect(emptyElement).toBeInTheDocument();
        expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
      });

      it("then does not display articles container", () => {
        render(<BlogSection articles={[]} />);

        expect(
          screen.queryByTestId(BLOG_ARTICLES_TEST_ID),
        ).not.toBeInTheDocument();
      });
    });

    describe("when API is down or answers with error", () => {
      const mockError = new Error("Network error");

      it("then displays error message", () => {
        render(<BlogSection error={mockError} />);

        const errorElement = screen.getByTestId(BLOG_ERROR_TEST_ID);

        expect(errorElement).toBeInTheDocument();
        expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
      });

      it("then displays retry button", () => {
        const onRetry = vi.fn();
        render(<BlogSection error={mockError} onRetry={onRetry} />);

        const retryButton = screen.getByTestId(BLOG_RETRY_BUTTON_TEST_ID);

        expect(retryButton).toBeInTheDocument();
        expect(retryButton).toHaveTextContent(RETRY_BUTTON_TEXT);
      });

      it("then does not display articles", () => {
        render(<BlogSection error={mockError} articles={mockArticles} />);

        expect(
          screen.queryByTestId(BLOG_ARTICLES_TEST_ID),
        ).not.toBeInTheDocument();
      });
    });

    describe("when answer does not match schema", () => {
      it("then treats it as error state", () => {
        const schemaError = new Error("Validation failed");
        render(<BlogSection error={schemaError} />);

        const errorElement = screen.getByTestId(BLOG_ERROR_TEST_ID);

        expect(errorElement).toBeInTheDocument();
        expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
      });

      it("then does not show partial broken answer", () => {
        const schemaError = new Error("Validation failed");
        render(<BlogSection error={schemaError} articles={mockArticles} />);

        expect(
          screen.queryByTestId(BLOG_ARTICLES_TEST_ID),
        ).not.toBeInTheDocument();
        expect(screen.queryByText("First Article")).not.toBeInTheDocument();
      });
    });

    describe("when visitor tries again", () => {
      it("then calls onRetry callback", () => {
        const onRetry = vi.fn();
        const mockError = new Error("Network error");

        render(<BlogSection error={mockError} onRetry={onRetry} />);

        const retryButtonWrapper = screen.getByTestId(
          BLOG_RETRY_BUTTON_TEST_ID,
        );
        const retryButton = retryButtonWrapper.querySelector("button");

        if (retryButton) {
          fireEvent.click(retryButton);
        }

        expect(onRetry).toHaveBeenCalledTimes(1);
      });
    });

    describe("when article has very long title", () => {
      it("then wraps title correctly without horizontal scroll", () => {
        const longTitleArticle: Article = {
          id: "123e4567-e89b-12d3-a456-426614174003",
          title:
            "This is a very long article title that should wrap properly and never make the page scroll sideways",
          content: "Content",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        };

        render(<BlogSection articles={[longTitleArticle]} />);

        const title = screen.getByText(longTitleArticle.title);

        expect(title).toHaveClass("break-words");
      });
    });

    describe("when checking component structure", () => {
      it("then renders as section element", () => {
        render(<BlogSection />);

        const section = screen.getByTestId(BLOG_SECTION_TEST_ID);

        expect(section).toBeInTheDocument();
        expect(section.tagName).toBe("SECTION");
      });

      it("then has heading with correct text", () => {
        render(<BlogSection />);

        const heading = screen.getByRole("heading", { level: 2 });

        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent("Articles");
      });

      it("then has responsive grid classes for articles", () => {
        render(<BlogSection articles={mockArticles} />);

        const articlesContainer = screen.getByTestId(BLOG_ARTICLES_TEST_ID);

        expect(articlesContainer).toHaveClass("grid");
        expect(articlesContainer).toHaveClass("md:grid-cols-2");
      });
    });
  });
});
