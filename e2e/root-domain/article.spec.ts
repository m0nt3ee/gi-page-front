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
    // Set up API mocking before each test
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
      // Given: The blog section is loaded with articles
      await page.goto("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');

      // When: User clicks on the first article
      const firstArticleCard = page
        .locator('[data-testid="article-card"]')
        .first();
      await firstArticleCard.click();

      // Then: The article page loads and displays the full article
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

      // And: The page is scrolled to the top
      const scrollPosition = await page.evaluate(() => window.scrollY);
      expect(scrollPosition).toBe(0);

      // When: User clicks the back button
      const backButton = page.locator(
        '[data-testid="article-page-back-button"]',
      );
      const button = backButton.locator("button");
      await button.click();

      // Then: User returns to the blog page
      await page.waitForURL("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');
      const articlesSection = page.locator('[data-testid="blog-articles"]');
      await expect(articlesSection).toBeVisible();
    });

    test("uses browser back button to return to blog page", async ({
      page,
    }) => {
      // Given: Articles are loaded
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

      // When: User navigates to home, then to article
      await page.goto("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');

      const firstArticleCard = page
        .locator('[data-testid="article-card"]')
        .first();
      await firstArticleCard.click();

      await page.waitForURL("**/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      // When: User clicks browser back button
      await page.goBack();

      // Then: User returns to blog page
      await page.waitForURL("/blog");
      await page.waitForSelector('[data-testid="blog-articles"]');
    });
  });

  test.describe("Loading State", () => {
    test("shows loading indicator while article is loading", async ({
      page,
    }) => {
      // Override the default mock with a delayed response
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

      // When: User navigates to article page
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");

      // Then: Loading indicator is visible
      const loadingElement = page.locator(
        '[data-testid="article-page-loading"]',
      );
      await expect(loadingElement).toBeVisible();
      await expect(loadingElement).toContainText("Loading article...");

      // And: Loading spinner is present
      const spinner = page.locator('[aria-label="Loading spinner"]');
      await expect(spinner).toBeVisible();
    });
  });

  test.describe("Article Not Found", () => {
    test("shows not found message when article does not exist", async ({
      page,
    }) => {
      // Given: API returns 404
      await page.route("**/api/v1/articles/non-existent-id", async (route) => {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ error: "Article not found" }),
        });
      });

      // When: User navigates to non-existent article
      await page.goto("/article/non-existent-id");

      // Then: Not found message is displayed
      await page.waitForSelector('[data-testid="article-page-not-found"]');
      const notFoundElement = page.locator(
        '[data-testid="article-page-not-found"]',
      );
      await expect(notFoundElement).toContainText("Article not found");
      await expect(notFoundElement).toContainText(
        "doesn't exist or has been removed",
      );

      // And: Back button is available
      const backButton = page.locator(
        '[data-testid="article-page-back-button"]',
      );
      await expect(backButton).toBeVisible();
    });

    test("shows not found message for invalid UUID", async ({ page }) => {
      // When: User navigates to article with invalid ID format
      await page.goto("/article/invalid-uuid-format");

      // Then: Not found message is displayed
      await page.waitForSelector('[data-testid="article-page-not-found"]');
      const notFoundElement = page.locator(
        '[data-testid="article-page-not-found"]',
      );
      await expect(notFoundElement).toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("shows error message when API is down", async ({ page }) => {
      // Override mock to return 500 error
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

      // When: User navigates to article
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");

      // Then: Error message is displayed
      await page.waitForSelector('[data-testid="article-page-error"]');
      const errorElement = page.locator('[data-testid="article-page-error"]');
      await expect(errorElement).toContainText("Failed to load article");

      // And: Retry button is available
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

      // Override mock with conditional response
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

      // When: User navigates to article and sees error
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-error"]');

      // And: User clicks retry button
      const retryButton = page.locator(
        '[data-testid="article-page-retry-button"]',
      );
      await retryButton.click();

      // Then: Article loads successfully
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
      // When: User opens article
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      // Then: All content is visible
      const articleText = page.locator('[data-testid="article-page-text"]');
      await expect(articleText).toContainText(
        "React and TypeScript are a powerful combination",
      );
      await expect(articleText).toContainText("improved code quality");
      await expect(articleText).toContainText(
        "explore the basics of setting up a React project",
      );

      // And: Content is structured in paragraphs
      const paragraphs = articleText.locator("p");
      const paragraphCount = await paragraphs.count();
      expect(paragraphCount).toBeGreaterThanOrEqual(3);
    });

    test("prevents XSS attacks by not executing HTML content", async ({
      page,
    }) => {
      // Given: Article with script tags
      const articleWithScript = {
        ...mockArticles[0],
        content:
          "Normal text <script>window.xssExecuted = true;</script> more text <b>bold</b> end",
      };

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

      // When: User opens article
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      // Then: Script is not executed
      const xssExecuted = await page.evaluate(
        () => (window as any).xssExecuted,
      );
      expect(xssExecuted).toBeUndefined();

      // And: HTML tags are displayed as text
      const articleText = page.locator('[data-testid="article-page-text"]');
      await expect(articleText).toContainText("<script>");
      await expect(articleText).toContainText("<b>");
    });
  });

  test.describe("Direct Navigation", () => {
    test("loads article when opened directly from bookmark", async ({
      page,
    }) => {
      // When: User navigates directly to article URL
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");

      // Then: Article loads without visiting home page first
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
      // When: User opens first article
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174001");
      await page.waitForSelector('[data-testid="article-page-content"]');

      let articleTitle = page.locator('[data-testid="article-page-title"]');
      await expect(articleTitle).toHaveText(
        "Getting Started with React and TypeScript",
      );

      // And: User navigates to second article
      await page.goto("/article/123e4567-e89b-12d3-a456-426614174002");
      await page.waitForSelector('[data-testid="article-page-content"]');

      // Then: New article loads and old one is not visible
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

      // Check for semantic article element
      const article = page.locator("article");
      await expect(article).toBeVisible();

      // Check for heading hierarchy
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();

      // Check for time element with datetime attribute
      const timeElement = page.locator("time");
      await expect(timeElement).toHaveAttribute("datetime");
    });
  });
});
