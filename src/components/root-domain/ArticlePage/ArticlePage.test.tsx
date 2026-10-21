import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Article } from "../../../services/api";
import ArticlePage from "./ArticlePage";
import {
  ARTICLE_PAGE_BACK_BUTTON_TEST_ID,
  ARTICLE_PAGE_CONTENT_TEST_ID,
  ARTICLE_PAGE_DATE_TEST_ID,
  ARTICLE_PAGE_ERROR_TEST_ID,
  ARTICLE_PAGE_LOADING_TEST_ID,
  ARTICLE_PAGE_NOT_FOUND_TEST_ID,
  ARTICLE_PAGE_RETRY_BUTTON_TEST_ID,
  ARTICLE_PAGE_TEXT_TEST_ID,
  ARTICLE_PAGE_TITLE_TEST_ID,
  BACK_BUTTON_TEXT,
  ERROR_MESSAGE,
  LOADING_MESSAGE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_MESSAGE,
  RETRY_BUTTON_TEXT,
} from "./ArticlePage.constants";

describe("ArticlePage", () => {
  const mockArticle: Article = {
    id: "123e4567-e89b-12d3-a456-426614174001",
    title: "Test Article",
    content:
      "This is the article content with multiple paragraphs.\n\nThis is the second paragraph.",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  };

  const mockOnRetry = vi.fn();
  const mockOnBack = vi.fn();

  describe("Given the loading state", () => {
    describe("when isLoading is true", () => {
      it("then shows loading spinner and message", () => {
        render(
          <ArticlePage
            article={null}
            isLoading={true}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const loadingElement = screen.getByTestId(ARTICLE_PAGE_LOADING_TEST_ID);
        expect(loadingElement).toBeInTheDocument();
        expect(screen.getByText(LOADING_MESSAGE)).toBeInTheDocument();
        expect(screen.getByLabelText("Loading spinner")).toBeInTheDocument();
      });
    });
  });

  describe("Given the error state", () => {
    describe("when error exists", () => {
      it("then shows error message with retry and back buttons", () => {
        const mockError = new Error("Network error");

        render(
          <ArticlePage
            article={null}
            isLoading={false}
            error={mockError}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const errorElement = screen.getByTestId(ARTICLE_PAGE_ERROR_TEST_ID);
        expect(errorElement).toBeInTheDocument();
        expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();

        expect(
          screen.getByTestId(ARTICLE_PAGE_RETRY_BUTTON_TEST_ID),
        ).toBeInTheDocument();
        expect(screen.getByText(RETRY_BUTTON_TEXT)).toBeInTheDocument();

        expect(
          screen.getByTestId(ARTICLE_PAGE_BACK_BUTTON_TEST_ID),
        ).toBeInTheDocument();
        expect(screen.getByText(BACK_BUTTON_TEXT)).toBeInTheDocument();
      });

      it("then calls onRetry when retry button is clicked", async () => {
        const user = userEvent.setup();
        const mockError = new Error("Network error");

        render(
          <ArticlePage
            article={null}
            isLoading={false}
            error={mockError}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const retryButton = screen.getByTestId(
          ARTICLE_PAGE_RETRY_BUTTON_TEST_ID,
        );
        const button = retryButton.querySelector("button");
        if (button) {
          await user.click(button);
        }

        expect(mockOnRetry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given the not found state", () => {
    describe("when notFound is true", () => {
      it("then shows not found message with back button", () => {
        render(
          <ArticlePage
            article={null}
            isLoading={false}
            error={null}
            notFound={true}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const notFoundElement = screen.getByTestId(
          ARTICLE_PAGE_NOT_FOUND_TEST_ID,
        );
        expect(notFoundElement).toBeInTheDocument();
        expect(screen.getByText(NOT_FOUND_MESSAGE)).toBeInTheDocument();
        expect(screen.getByText(NOT_FOUND_DESCRIPTION)).toBeInTheDocument();
        expect(
          screen.getByTestId(ARTICLE_PAGE_BACK_BUTTON_TEST_ID),
        ).toBeInTheDocument();
      });

      it("then calls onBack when back button is clicked", async () => {
        const user = userEvent.setup();

        render(
          <ArticlePage
            article={null}
            isLoading={false}
            error={null}
            notFound={true}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const backButton = screen.getByTestId(ARTICLE_PAGE_BACK_BUTTON_TEST_ID);
        const button = backButton.querySelector("button");
        if (button) {
          await user.click(button);
        }

        expect(mockOnBack).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given a valid article", () => {
    describe("when article is loaded", () => {
      it("then displays article title, date, and content", () => {
        const localMockOnBack = vi.fn();
        const localMockOnRetry = vi.fn();

        render(
          <ArticlePage
            article={mockArticle}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={localMockOnRetry}
            onBack={localMockOnBack}
          />,
        );

        const contentElement = screen.getByTestId(ARTICLE_PAGE_CONTENT_TEST_ID);
        expect(contentElement).toBeInTheDocument();

        const titleElement = screen.getByTestId(ARTICLE_PAGE_TITLE_TEST_ID);
        expect(titleElement).toHaveTextContent(mockArticle.title);

        const dateElement = screen.getByTestId(ARTICLE_PAGE_DATE_TEST_ID);
        expect(dateElement).toHaveAttribute("datetime", mockArticle.createdAt);
        expect(dateElement).toHaveTextContent("January 15, 2024");

        const textElement = screen.getByTestId(ARTICLE_PAGE_TEXT_TEST_ID);
        expect(textElement).toBeInTheDocument();
      });

      it("then formats date correctly", () => {
        render(
          <ArticlePage
            article={mockArticle}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const dateElement = screen.getByTestId(ARTICLE_PAGE_DATE_TEST_ID);
        expect(dateElement).toHaveTextContent("January 15, 2024");
      });

      it("then displays back button", () => {
        render(
          <ArticlePage
            article={mockArticle}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const backButton = screen.getByTestId(ARTICLE_PAGE_BACK_BUTTON_TEST_ID);
        expect(backButton).toBeInTheDocument();
      });

      it("then calls onBack when back button is clicked", async () => {
        const user = userEvent.setup();
        const localMockOnBack = vi.fn();
        const localMockOnRetry = vi.fn();

        render(
          <ArticlePage
            article={mockArticle}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={localMockOnRetry}
            onBack={localMockOnBack}
          />,
        );

        const backButton = screen.getByTestId(ARTICLE_PAGE_BACK_BUTTON_TEST_ID);
        const button = backButton.querySelector("button");
        if (button) {
          await user.click(button);
        }

        expect(localMockOnBack).toHaveBeenCalledTimes(1);
      });

      it("then splits content into paragraphs", () => {
        render(
          <ArticlePage
            article={mockArticle}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const textElement = screen.getByTestId(ARTICLE_PAGE_TEXT_TEST_ID);
        const paragraphs = textElement.querySelectorAll("p");
        expect(paragraphs.length).toBeGreaterThan(0);
      });
    });

    describe("when article content contains HTML tags", () => {
      it("then renders HTML as plain text without executing scripts", () => {
        const articleWithHtml: Article = {
          ...mockArticle,
          content:
            "Normal text <script>alert('XSS')</script> more text <b>bold</b> end",
        };

        render(
          <ArticlePage
            article={articleWithHtml}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const textElement = screen.getByTestId(ARTICLE_PAGE_TEXT_TEST_ID);
        expect(textElement.textContent).toContain("<script>");
        expect(textElement.textContent).toContain("<b>");
        expect(textElement.textContent).toContain("alert('XSS')");
      });

      it("then does not execute any scripts", () => {
        const scriptExecuted = vi.fn();
        (window as any).testXSS = scriptExecuted;

        const articleWithScript: Article = {
          ...mockArticle,
          content: "Text <script>window.testXSS()</script> more",
        };

        render(
          <ArticlePage
            article={articleWithScript}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        expect(scriptExecuted).not.toHaveBeenCalled();
      });
    });

    describe("when article has long title", () => {
      it("then handles word wrapping", () => {
        const longTitleArticle: Article = {
          ...mockArticle,
          title:
            "Understanding the Advanced Concepts of State Management in Modern React Applications with TypeScript",
        };

        render(
          <ArticlePage
            article={longTitleArticle}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const titleElement = screen.getByTestId(ARTICLE_PAGE_TITLE_TEST_ID);
        expect(titleElement).toHaveClass("break-words");
        expect(titleElement).toHaveTextContent(longTitleArticle.title);
      });
    });

    describe("when article has empty content lines", () => {
      it("then filters out empty lines", () => {
        const articleWithEmptyLines: Article = {
          ...mockArticle,
          content: "First paragraph\n\n\n\nSecond paragraph\n\n",
        };

        render(
          <ArticlePage
            article={articleWithEmptyLines}
            isLoading={false}
            error={null}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        const textElement = screen.getByTestId(ARTICLE_PAGE_TEXT_TEST_ID);
        expect(textElement).toBeInTheDocument();
      });
    });
  });

  describe("Given state priority", () => {
    describe("when isLoading is true", () => {
      it("then shows loading even if error exists", () => {
        render(
          <ArticlePage
            article={null}
            isLoading={true}
            error={new Error("error")}
            notFound={false}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        expect(
          screen.getByTestId(ARTICLE_PAGE_LOADING_TEST_ID),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(ARTICLE_PAGE_ERROR_TEST_ID),
        ).not.toBeInTheDocument();
      });
    });

    describe("when notFound is true and not loading", () => {
      it("then shows not found even if error exists", () => {
        render(
          <ArticlePage
            article={null}
            isLoading={false}
            error={new Error("error")}
            notFound={true}
            onRetry={mockOnRetry}
            onBack={mockOnBack}
          />,
        );

        expect(
          screen.getByTestId(ARTICLE_PAGE_NOT_FOUND_TEST_ID),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(ARTICLE_PAGE_ERROR_TEST_ID),
        ).not.toBeInTheDocument();
      });
    });
  });
});
