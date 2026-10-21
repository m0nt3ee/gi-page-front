import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ArticlePage from "./ArticlePage";

const meta: Meta<typeof ArticlePage> = {
  title: "Root Domain/ArticlePage",
  component: ArticlePage,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onRetry: fn(),
    onBack: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArticlePage>;

export const Loading: Story = {
  args: {
    article: null,
    isLoading: true,
    error: null,
    notFound: false,
  },
};

export const ArticleLoaded: Story = {
  args: {
    article: {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "Getting Started with React and TypeScript",
      content:
        "React and TypeScript are a powerful combination for building modern web applications. TypeScript adds static typing to JavaScript, which helps catch errors early in the development process and provides better tooling support.\n\nOne of the main benefits of using TypeScript with React is improved code quality. The type system helps you define props, state, and return types clearly, making your code more maintainable and easier to understand.\n\nIn this article, we'll explore the basics of setting up a React project with TypeScript and discuss best practices for writing type-safe components.",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z",
    },
    isLoading: false,
    error: null,
    notFound: false,
  },
};

export const ArticleWithLongTitle: Story = {
  args: {
    article: {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title:
        "Understanding the Advanced Concepts of State Management in Modern React Applications with TypeScript, Redux, Zustand, and Context API for Building Scalable Enterprise Applications",
      content:
        "State management is a crucial aspect of building complex React applications. When your application grows, managing state becomes more challenging.\n\nThere are several approaches to state management in React, each with its own trade-offs. Context API is built into React and works well for simple cases. Redux provides a centralized store and is great for large applications. Zustand offers a simpler API while maintaining powerful features.\n\nChoosing the right state management solution depends on your application's needs.",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z",
    },
    isLoading: false,
    error: null,
    notFound: false,
  },
};

export const ArticleWithMultipleParagraphs: Story = {
  args: {
    article: {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "Building Accessible Web Applications",
      content:
        "Web accessibility is not just a nice-to-have feature; it's a necessity. Making your applications accessible ensures that everyone, regardless of their abilities, can use your product.\n\nThere are several key principles to follow when building accessible applications. First, use semantic HTML elements. This helps screen readers understand the structure of your page.\n\nSecond, provide alternative text for images. Screen readers rely on alt text to describe images to users who can't see them.\n\nThird, ensure keyboard navigation works properly. Not all users can use a mouse, so your application should be fully navigable with just a keyboard.\n\nFinally, use ARIA attributes when necessary to provide additional context to assistive technologies.",
      createdAt: "2024-01-13T14:20:00.000Z",
      updatedAt: "2024-01-13T14:20:00.000Z",
    },
    isLoading: false,
    error: null,
    notFound: false,
  },
};

export const ArticleWithHTMLContent: Story = {
  args: {
    article: {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "Security and XSS Prevention",
      content:
        "This article contains HTML tags that should be rendered as plain text: <script>alert('XSS')</script>\n\nThe <b>bold</b> tags and <i>italic</i> tags should also appear as text, not as formatted HTML.\n\nThis ensures that user-generated content cannot execute malicious scripts on the page.",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z",
    },
    isLoading: false,
    error: null,
    notFound: false,
  },
};

export const Error: Story = {
  args: {
    article: null,
    isLoading: false,
    error: new Error("Failed to load article"),
    notFound: false,
  },
};

export const NotFound: Story = {
  args: {
    article: null,
    isLoading: false,
    error: null,
    notFound: true,
  },
};

export const ErrorWithRetry: Story = {
  args: {
    article: null,
    isLoading: false,
    error: new Error("Network error - please try again"),
    notFound: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const retryButton = canvas.querySelector(
      '[data-testid="article-page-retry-button"]',
    );
    console.log("Retry button available:", !!retryButton);
  },
};
