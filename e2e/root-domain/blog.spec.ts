import { expect, test } from "@playwright/test";

test.describe("Blog Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          articles: [
            {
              id: "123e4567-e89b-12d3-a456-426614174001",
              title: "Getting Started with React and TypeScript",
              content:
                "Learn how to set up a React project with TypeScript for better type safety...",
              createdAt: "2024-01-15T10:30:00.000Z",
              updatedAt: "2024-01-15T10:30:00.000Z",
            },
            {
              id: "123e4567-e89b-12d3-a456-426614174002",
              title: "Understanding State Management with Zustand",
              content:
                "A comprehensive guide to using Zustand for state management...",
              createdAt: "2024-01-14T09:00:00.000Z",
              updatedAt: "2024-01-14T09:00:00.000Z",
            },
            {
              id: "123e4567-e89b-12d3-a456-426614174003",
              title: "Building Accessible Web Applications",
              content:
                "Best practices for creating inclusive and accessible web apps...",
              createdAt: "2024-01-13T14:20:00.000Z",
              updatedAt: "2024-01-13T14:20:00.000Z",
            },
          ],
        }),
      });
    });
  });

  test("displays articles from API in order newest first", async ({ page }) => {
    await page.goto("/blog");

    await page.waitForSelector('[data-testid="blog-articles"]');

    const articlesSection = page.locator('[data-testid="blog-articles"]');
    await expect(articlesSection).toBeVisible();

    const articleCards = page.locator('[data-testid="article-card"]');
    await expect(articleCards).toHaveCount(3);

    const firstArticle = articleCards.nth(0);
    await expect(firstArticle).toContainText(
      "Getting Started with React and TypeScript",
    );
    await expect(firstArticle).toContainText("January 15, 2024");

    const secondArticle = articleCards.nth(1);
    await expect(secondArticle).toContainText(
      "Understanding State Management with Zustand",
    );
    await expect(secondArticle).toContainText("January 14, 2024");

    const thirdArticle = articleCards.nth(2);
    await expect(thirdArticle).toContainText(
      "Building Accessible Web Applications",
    );
    await expect(thirdArticle).toContainText("January 13, 2024");
  });

  test("shows loading state initially", async ({ page }) => {
    await page.unroute("**/api/v1/articles");
    await page.route("**/api/v1/articles", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [] }),
      });
    });

    await page.goto("/blog");

    const loadingElement = page.locator('[data-testid="blog-loading"]');
    await expect(loadingElement).toBeVisible();
    await expect(loadingElement).toContainText("Loading articles...");
  });

  test("shows empty state when no articles", async ({ page }) => {
    await page.unroute("**/api/v1/articles");
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [] }),
      });
    });

    await page.goto("/blog");

    const emptyElement = page.locator('[data-testid="blog-empty"]');
    await expect(emptyElement).toBeVisible();
    await expect(emptyElement).toContainText("No articles yet");
  });

  test("shows error state when API fails", async ({ page }) => {
    await page.unroute("**/api/v1/articles");
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    await page.goto("/blog");

    const errorElement = page.locator('[data-testid="blog-error"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText("Failed to load articles");

    const retryButton = page.locator('[data-testid="blog-retry-button"]');
    await expect(retryButton).toBeVisible();
  });

  test("retries loading articles when retry button is clicked", async ({
    page,
  }) => {
    let requestCount = 0;

    await page.unroute("**/api/v1/articles");
    await page.route("**/api/v1/articles", async (route) => {
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
          body: JSON.stringify({
            articles: [
              {
                id: "123e4567-e89b-12d3-a456-426614174001",
                title: "Test Article",
                content: "Test content",
                createdAt: "2024-01-15T10:30:00.000Z",
                updatedAt: "2024-01-15T10:30:00.000Z",
              },
            ],
          }),
        });
      }
    });

    await page.goto("/blog");

    await page.waitForSelector('[data-testid="blog-error"]');

    const retryButton = page.locator('[data-testid="blog-retry-button"]');
    await retryButton.click();

    await page.waitForSelector('[data-testid="blog-articles"]');

    const articlesSection = page.locator('[data-testid="blog-articles"]');
    await expect(articlesSection).toBeVisible();

    const articleCards = page.locator('[data-testid="article-card"]');
    await expect(articleCards).toHaveCount(1);
  });

  test("handles long article titles without horizontal scroll", async ({
    page,
  }) => {
    await page.unroute("**/api/v1/articles");
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          articles: [
            {
              id: "123e4567-e89b-12d3-a456-426614174001",
              title:
                "Understanding the Advanced Concepts of State Management in Modern React Applications with TypeScript, Zustand, and Context API for Building Scalable Enterprise Applications",
              content: "Test content",
              createdAt: "2024-01-15T10:30:00.000Z",
              updatedAt: "2024-01-15T10:30:00.000Z",
            },
          ],
        }),
      });
    });

    await page.goto("/blog");

    await page.waitForSelector('[data-testid="blog-articles"]');

    const viewportWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);

    expect(viewportWidth).toBeLessThanOrEqual(windowWidth + 20);
  });

  test("has correct semantic HTML structure", async ({ page }) => {
    await page.goto("/blog");

    await page.waitForSelector('[data-testid="blog-articles"]');

    const section = page.locator("section[data-testid='blog-section']");
    await expect(section).toBeVisible();

    const heading = page.locator("h2", { hasText: "ARTICLES" });
    await expect(heading).toBeVisible();

    const articles = page.locator("article[data-testid='article-card']");
    await expect(articles.first()).toBeVisible();

    const timeElements = page.locator("time");
    await expect(timeElements.first()).toHaveAttribute("datetime");
  });

  test("page remains functional during loading", async ({ page }) => {
    await page.unroute("**/api/v1/articles");
    await page.route("**/api/v1/articles", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [] }),
      });
    });

    await page.goto("/blog");

    const section = page.locator("section[data-testid='blog-section']");
    await expect(section).toBeVisible();

    const heading = page.locator("h2", { hasText: "ARTICLES" });
    await expect(heading).toBeVisible();

    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForSelector('[data-testid="blog-empty"]', {
      timeout: 5000,
    });

    expect(errors).toHaveLength(0);
  });
});
