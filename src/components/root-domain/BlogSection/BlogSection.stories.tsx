import type { Meta, StoryObj } from "@storybook/react";
import type { Article } from "../../../services/api";
import BlogSection from "./BlogSection";

const meta = {
  title: "Root Domain/BlogSection",
  component: BlogSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Section component displaying a list of articles with loading, error, and empty states.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-neutral-950 min-h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BlogSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockArticles: Article[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Getting Started with React and TypeScript",
    content: "Content of the article...",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    title: "Advanced State Management Patterns",
    content: "Content of the article...",
    createdAt: "2024-02-20T14:45:00.000Z",
    updatedAt: "2024-02-20T14:45:00.000Z",
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    title: "Building Scalable Frontend Applications",
    content: "Content of the article...",
    createdAt: "2024-03-10T09:15:00.000Z",
    updatedAt: "2024-03-10T09:15:00.000Z",
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174003",
    title: "Best Practices for Testing React Components",
    content: "Content of the article...",
    createdAt: "2024-04-05T16:20:00.000Z",
    updatedAt: "2024-04-05T16:20:00.000Z",
  },
];

export const Default: Story = {
  args: {
    articles: mockArticles,
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default blog section with a list of articles displayed in a grid",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    articles: undefined,
    isLoading: true,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state with spinner animation",
      },
    },
  },
};

export const Error: Story = {
  args: {
    articles: undefined,
    isLoading: false,
    error: new Error("Failed to load articles"),
    onRetry: () => console.log("Retry button clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Error state with retry button",
      },
    },
  },
};

export const ErrorWithoutRetry: Story = {
  args: {
    articles: undefined,
    isLoading: false,
    error: new Error("Failed to load articles"),
    onRetry: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "Error state without retry button",
      },
    },
  },
};

export const Empty: Story = {
  args: {
    articles: [],
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no articles are available",
      },
    },
  },
};

export const SingleArticle: Story = {
  args: {
    articles: [mockArticles[0]],
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Blog section with only one article",
      },
    },
  },
};

export const ManyArticles: Story = {
  args: {
    articles: [
      ...mockArticles,
      {
        id: "523e4567-e89b-12d3-a456-426614174004",
        title: "Understanding React Hooks in Depth",
        content: "Content of the article...",
        createdAt: "2024-05-12T11:30:00.000Z",
        updatedAt: "2024-05-12T11:30:00.000Z",
      },
      {
        id: "623e4567-e89b-12d3-a456-426614174005",
        title: "CSS-in-JS vs Tailwind: Which to Choose?",
        content: "Content of the article...",
        createdAt: "2024-06-18T13:45:00.000Z",
        updatedAt: "2024-06-18T13:45:00.000Z",
      },
    ],
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Blog section with many articles to demonstrate grid layout",
      },
    },
  },
};

export const LongTitles: Story = {
  args: {
    articles: [
      {
        id: "723e4567-e89b-12d3-a456-426614174006",
        title:
          "Understanding the Advanced Concepts of State Management in Modern React Applications with TypeScript and Zustand",
        content: "Content of the article...",
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T10:30:00.000Z",
      },
      {
        id: "823e4567-e89b-12d3-a456-426614174007",
        title:
          "A Comprehensive Guide to Building Scalable and Maintainable Frontend Architectures Using Modern Web Technologies",
        content: "Content of the article...",
        createdAt: "2024-02-20T14:45:00.000Z",
        updatedAt: "2024-02-20T14:45:00.000Z",
      },
    ],
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Articles with very long titles that wrap to multiple lines",
      },
    },
  },
};
