import type { Meta, StoryObj } from "@storybook/react";
import type { Article } from "../../../services/api";
import ArticleCard from "./ArticleCard";

const meta = {
  title: "Root Domain/ArticleCard",
  component: ArticleCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Card component displaying a single article with title and publication date.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockArticle: Article = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Getting Started with React and TypeScript",
  content: "Content of the article...",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z",
};

export const Default: Story = {
  args: {
    article: mockArticle,
  },
  parameters: {
    docs: {
      description: {
        story: "Default article card with standard title and date",
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    article: {
      ...mockArticle,
      title:
        "Understanding the Advanced Concepts of State Management in Modern React Applications with TypeScript and Zustand",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Article card with a very long title that wraps to multiple lines",
      },
    },
  },
};

export const RecentArticle: Story = {
  args: {
    article: {
      ...mockArticle,
      createdAt: new Date().toISOString(),
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Article card with today's date",
      },
    },
  },
};

export const OldArticle: Story = {
  args: {
    article: {
      ...mockArticle,
      createdAt: "2020-03-10T08:00:00.000Z",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Article card with an older publication date",
      },
    },
  },
};
