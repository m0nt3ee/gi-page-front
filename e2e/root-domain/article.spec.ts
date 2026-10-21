import { expect, test } from "@playwright/test";

test.describe("Article Page", () => {
  const mockArticles = [
    {
      id: "123e4567-e89b-12d3-a456-426614174001",
      title: "Getting Started with React and TypeScript",
      content:
        "React and TypeScript are a powerful combination for building modern web applications. TypeScript adds static typing to JavaScript, which helps catch errors early in the development process.\n\nOne of the main benefits is improved code quality. The type system helps you define props, state, and return types clearly.\n\nIn this article, we'll explore the basics of setting up a React project with TypeScript.",
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z",
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174002",
      title: "Understanding State Management with Zustand",
      content: "A comprehensive guide to using Zustand for state management...",
      createdAt: "2024-01-14T09:00:00.000Z",
      updatedAt: "2024-01-14T09:00:00.000Z",
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: mockArticles }),
      });
    });

    await page.route(
      "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockArticles[0]),
        });
      },
    );

    await page.route(
      "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174002",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockArticles[1]),
        });
      },
    );
  });

  test.describe("Happy Path: From blog to article and back", () => {
    test("navigates from blog section to article and back to blog", async ({
      page,
    }) => {
      await page.goto("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');

      const firstArticleCard = page
        .locator('[data-testid="article-card"]')
        .first();
      await firstArticleCard.click();

      await page.waitForURL("**/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      const articleTitle = page.locator('[data-testid="article-page-title"]');
      await expect(articleTitle).toHaveText(
        "Getting Started with React and TypeScript",
      );

      const articleDate = page.locator('[data-testid="article-page-date"]');
      await expect(articleDate).toHaveText("January 15, 2024");

      const articleText = page.locator('[data-testid="article-page-text"]');
      await expect(articleText).toContainText(
        "React and TypeScript are a powerful combination",
      );
      await expect(articleText).toContainText("improved code quality");

      const scrollPosition = await page.evaluate(() => window.scrollY);
      expect(scrollPosition).toBe(0);

      const backButton = page.locator(
        '[data-testid="article-page-back-button"]',
      );
      const button = backButton.locator("button");
      await button.click();

      await page.waitForURL("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');
      const articlesSection = page.locator('[data-testid="blog-articles"]');
      await expect(articlesSection).toBeVisible();
    });

    test("uses browser back button to return to blog page", async ({
      page,
    }) => {
      await page.route("**/api/v1/articles", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ articles: mockArticles }),
        });
      });

      await page.route(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(mockArticles[0]),
          });
        },
      );

      await page.goto("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');

      const firstArticleCard = page
        .locator('[data-testid="article-card"]')
        .first();
      await firstArticleCard.click();

      await page.waitForURL("**/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      await page.goBack();

      await page.waitForURL("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');
    });
  });

  test.describe("Loading State", () => {
    test("shows loading indicator while article is loading", async ({
      page,
    }) => {
      await page.unroute(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
      );
      await page.route(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
        async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(mockArticles[0]),
          });
        },
      );
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");

      const loadingElement = page.locator(
        '[data-testid="article-page-loading"]',
      );
      await expect(loadingElement).toBeVisible();
      await expect(loadingElement).toContainText("Loading article...");

      const spinner = page.locator('[aria-label="Loading spinner"]');
      await expect(spinner).toBeVisible();
    });
  });

  test.describe("Article Not Found", () => {
    test("shows not found message when article does not exist", async ({
      page,
    }) => {
      await page.route("**/api/v1/articles/non-existent-id", async (route) => {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ error: "Article not found" }),
        });
      });

      await page.goto("/article/non-existent-id");

      await page.waitForSelector('[data-testid="article-page-not-found"]');
      const notFoundElement = page.locator(
        '[data-testid="article-page-not-found"]',
      );
      await expect(notFoundElement).toContainText("Article not found");
      await expect(notFoundElement).toContainText(
        "doesn't exist or has been removed",
      );

      const backButton = page.locator(
        '[data-testid="article-page-back-button"]',
      );
      await expect(backButton).toBeVisible();
    });

    test("shows not found message for invalid UUID", async ({ page }) => {
      await page.goto("/article/invalid-uuid-format");

      await page.waitForSelector('[data-testid="article-page-not-found"]');
      const notFoundElement = page.locator(
        '[data-testid="article-page-not-found"]',
      );
      await expect(notFoundElement).toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("shows error message when API is down", async ({ page }) => {
      await page.unroute(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
      );
      await page.route(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
        async (route) => {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: "Internal server error" }),
          });
        },
      );

      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");

      await page.waitForSelector('[data-testid="article-page-error"]');
      const errorElement = page.locator('[data-testid="article-page-error"]');
      await expect(errorElement).toContainText("Failed to load article");

      const retryButton = page.locator(
        '[data-testid="article-page-retry-button"]',
      );
      await expect(retryButton).toBeVisible();
      await expect(retryButton).toContainText("Try Again");
    });

    test("retries loading article when retry button is clicked", async ({
      page,
    }) => {
      let requestCount = 0;

      await page.unroute(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
      );
      await page.route(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
        async (route) => {
          requestCount++;
          if (requestCount === 1) {
            await route.fulfill({
              status: 500,
              contentType: "application/json",
              body: JSON.stringify({ error: "Internal server error" }),
            });
          } else {
            await route.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify(mockArticles[0]),
            });
          }
        },
      );

      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-error"]');

      const retryButton = page.locator(
        '[data-testid="article-page-retry-button"]',
      );
      await retryButton.click();

      await page.waitForSelector('[data-testid="article-page-content"]');
      const articleTitle = page.locator('[data-testid="article-page-title"]');
      await expect(articleTitle).toHaveText(
        "Getting Started with React and TypeScript",
      );
    });
  });

  test.describe("Content Display", () => {
    test("displays full article with paragraphs preserved", async ({
      page,
    }) => {
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      const articleText = page.locator('[data-testid="article-page-text"]');
      await expect(articleText).toContainText(
        "React and TypeScript are a powerful combination",
      );
      await expect(articleText).toContainText("improved code quality");
      await expect(articleText).toContainText(
        "explore the basics of setting up a React project",
      );

      const paragraphs = articleText.locator("p");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThanOrEqual(3);
    });

    test("prevents XSS attacks by not executing HTML content", async ({
      page,
    }) => {
      const articleWithScript = {
        ...mockArticles[0],
        content:
          "Normal text <script>window.xssExecuted = true;</script> more text <b>bold</b> end",
      };

      await page.unroute(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
      );
      await page.route(
        "**/api/v1/articles/123e4567-e89b-12d3-a456-426614174001",
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(articleWithScript),
          });
        },
      );

      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      const xssExecuted = await page.evaluate(
        () => (window as any).xssExecuted,
      );
      expect(xssExecuted).toBeUndefined();

      const articleText = page.locator('[data-testid="article-page-text"]');
      await expect(articleText).toContainText("<script>");
      await expect(articleText).toContainText("<b>");
    });
  });

  test.describe("Direct Navigation", () => {
    test("loads article when opened directly from bookmark", async ({
      page,
    }) => {
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");

      await page.waitForSelector('[data-testid="article-page-content"]');
      const articleTitle = page.locator('[data-testid="article-page-title"]');
      await expect(articleTitle).toHaveText(
        "Getting Started with React and TypeScript",
      );
    });
  });

  test.describe("Navigation Between Articles", () => {
    test("loads new article when navigating from one article to another", async ({
      page,
    }) => {
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      let articleTitle = page.locator('[data-testid="article-page-title"]');
      await expect(articleTitle).toHaveText(
        "Getting Started with React and TypeScript",
      );

      await page.goto("/article/123e4567-e89b-12d3-a456-426614174002");
      await page.waitForSelector('[data-testid="article-page-content"]');

      articleTitle = page.locator('[data-testid="article-page-title"]');
      await expect(articleTitle).toHaveText(
        "Understanding State Management with Zustand",
      );
      await expect(articleTitle).not.toContainText("React and TypeScript");
    });
  });

  test.describe("Accessibility", () => {
    test("has correct semantic HTML structure", async ({ page }) => {
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      const article = page.locator("article");
      await expect(article).toBeVisible();

      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();

      const timeElement = page.locator("time");
      await expect(timeElement).toHaveAttribute("datetime");
    });
  });
});
