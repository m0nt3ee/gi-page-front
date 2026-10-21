import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { Article } from "../../../services/api";
import ArticleCard from "./ArticleCard";
import {
  ARTICLE_CARD_TEST_ID,
  ARTICLE_DATE_TEST_ID,
  ARTICLE_TITLE_TEST_ID,
} from "./ArticleCard.constants";

describe("<ArticleCard />", () => {
  const mockArticle: Article = {
    id: "123e4567-e89b-12d3-a456-426614174001",
    title: "Test Article",
    content: "This is a test content for the article card.",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  };

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("Given an ArticleCard component", () => {
    describe("when rendered with an article", () => {
      it("then displays the article title", () => {
        renderWithRouter(<ArticleCard article={mockArticle} />);

        const title = screen.getByTestId(ARTICLE_TITLE_TEST_ID);

        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent("Test Article");
      });

      it("then displays the formatted date", () => {
        renderWithRouter(<ArticleCard article={mockArticle} />);

        const date = screen.getByTestId(ARTICLE_DATE_TEST_ID);

        expect(date).toBeInTheDocument();
        expect(date).toHaveTextContent("January 15, 2024");
      });

      it("then has correct datetime attribute", () => {
        renderWithRouter(<ArticleCard article={mockArticle} />);

        const date = screen.getByTestId(ARTICLE_DATE_TEST_ID);

        expect(date).toHaveAttribute("datetime", mockArticle.createdAt);
      });

      it("then renders as an article element", () => {
        renderWithRouter(<ArticleCard article={mockArticle} />);

        const card = screen.getByTestId(ARTICLE_CARD_TEST_ID);

        expect(card).toBeInTheDocument();
        expect(card.tagName).toBe("ARTICLE");
      });
    });

    describe("when article has a very long title", () => {
      it("then wraps the title correctly", () => {
        const longTitleArticle: Article = {
          ...mockArticle,
          title:
            "This is a very long article title that should wrap properly and not cause horizontal scrolling issues in the layout",
        };

        renderWithRouter(<ArticleCard article={longTitleArticle} />);

        const title = screen.getByTestId(ARTICLE_TITLE_TEST_ID);

        expect(title).toHaveClass("break-words");
      });
    });

    describe("when checking styling", () => {
      it("then has correct CSS classes for layout", () => {
        renderWithRouter(<ArticleCard article={mockArticle} />);

        const card = screen.getByTestId(ARTICLE_CARD_TEST_ID);

        expect(card).toHaveClass("bg-neutral-900");
        expect(card).toHaveClass("border");
        expect(card).toHaveClass("hover:border-teal-500");
      });

      it("then has cursor-pointer class", () => {
        renderWithRouter(<ArticleCard article={mockArticle} />);

        const card = screen.getByTestId(ARTICLE_CARD_TEST_ID);

        expect(card).toHaveClass("cursor-pointer");
      });
    });

    describe("when displaying content preview", () => {
      it("then shows full content if under 100 characters", () => {
        const shortContentArticle: Article = {
          ...mockArticle,
          content: "Short content",
        };

        renderWithRouter(<ArticleCard article={shortContentArticle} />);

        expect(screen.getByText("Short content")).toBeInTheDocument();
      });

      it("then truncates content with ellipsis if over 100 characters", () => {
        const longContentArticle: Article = {
          ...mockArticle,
          content:
            "This is a very long content that exceeds one hundred characters and should be truncated with ellipsis at the end to prevent taking too much space in the card preview display",
        };

        renderWithRouter(<ArticleCard article={longContentArticle} />);

        const preview = screen.getByText(/This is a very long content.../);
        expect(preview).toBeInTheDocument();
        expect(preview.textContent).toHaveLength(103); // 100 chars + "..."
      });
    });
  });
});
