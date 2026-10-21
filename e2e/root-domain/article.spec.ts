import { expect, test } from "@playwright/test";

test.describe("Article Page", () => {
  const mockArticle = {
    id: "123e4567-e89b-12d3-a456-426614174001",
    title: "Getting Started with React and TypeScript",
    content:
      "React and TypeScript are a powerful combination for building modern web applications. TypeScript adds static typing to JavaScript, which helps catch errors early in the development process.\n\nOne of the main benefits is improved code quality. The type system helps you define props, state, and return types clearly.\n\nIn this article, we'll explore the basics of setting up a React project with TypeScript.",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  };

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/articles", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [mockArticle] }),
      });
    });

    await page.route("**/api/v1/articles/*", async (route) => {
      const url = route.request().url();
      if (url.includes(mockArticle.id)) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockArticle),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ error: "Article not found" }),
        });
      }
    });
  });

  test("navigates from blog to article and back", async ({ page }) => {
    await page.goto("/blog");
    await page.locator('[data-testid="article-card"]').first().click();

    await page.waitForURL(`**/article/${mockArticle.id}`);
    await expect(page.locator('[data-testid="article-page-title"]')).toHaveText(
      mockArticle.title,
    );
    await expect(page.locator('[data-testid="article-page-date"]')).toHaveText(
      "January 15, 2024",
    );
    await expect(
      page.locator('[data-testid="article-page-text"]'),
    ).toContainText("React and TypeScript are a powerful combination");

    await page
      .locator('[data-testid="article-page-back-button"] button')
      .click();
    await page.waitForURL("/blog");
    await expect(page.locator('[data-testid="blog-articles"]')).toBeVisible();
  });

  test("loads article directly via URL", async ({ page }) => {
    await page.goto(`/article/${mockArticle.id}`);
    await expect(
      page.locator('[data-testid="article-page-content"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="article-page-title"]')).toHaveText(
      mockArticle.title,
    );
  });

  test("shows not found state for invalid or non-existent article", async ({
    page,
  }) => {
    await page.goto("/article/00000000-0000-0000-0000-000000000000");
    await expect(
      page.locator('[data-testid="article-page-not-found"]'),
    ).toBeVisible();
    await page.goto("/article/invalid-uuid");
    await expect(
      page.locator('[data-testid="article-page-not-found"]'),
    ).toBeVisible();
  });

  test("handles error state and retries successfully", async ({ page }) => {
    let attempts = 0;
    await page.route("**/api/v1/articles/*", async (route) => {
      attempts++;
      if (attempts === 1) {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal server error" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockArticle),
        });
      }
    });

    await page.goto(`/article/${mockArticle.id}`);
    await expect(
      page.locator('[data-testid="article-page-error"]'),
    ).toBeVisible();

    await page
      .locator('[data-testid="article-page-retry-button"] button')
      .click();
    await expect(
      page.locator('[data-testid="article-page-content"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="article-page-title"]')).toHaveText(
      mockArticle.title,
    );
  });
});
