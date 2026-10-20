import { expect, test } from "@playwright/test";

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("when viewing the footer", () => {
    test("then they should see the contact email link", async ({ page }) => {
      const emailLink = page.getByRole("link", {
        name: /bartekj312@gmail.com/i,
      });
      await expect(emailLink).toBeVisible();
      await expect(emailLink).toHaveAttribute(
        "href",
        "mailto:bartekj312@gmail.com",
      );
    });

    test("then they should see all social media links", async ({ page }) => {
      const instagramButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="Instagram"]') });
      await expect(instagramButton).toBeVisible();

      const githubButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="GitHub"]') });
      await expect(githubButton).toBeVisible();

      const discordButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="Discord"]') });
      await expect(discordButton).toBeVisible();
    });

    test("then they should see the back to top button", async ({ page }) => {
      const backToTopButton = page.getByRole("button", {
        name: /back to top/i,
      });
      await expect(backToTopButton).toBeVisible();
    });
  });

  test.describe("when clicking the back to top button", () => {
    test("then the page should scroll to the top", async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const backToTopButton = page.getByRole("button", {
        name: /back to top/i,
      });
      await backToTopButton.click();

      await page.waitForTimeout(1000);

      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });
  });

  test.describe("when clicking social media links", () => {
    test("then Instagram link should open the correct URL", async ({
      page,
      context,
    }) => {
      const instagramButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="Instagram"]') });

      const pagePromise = context.waitForEvent("page");
      await instagramButton.click();
      const newPage = await pagePromise;

      await expect(newPage).toHaveURL(/instagram.com/);
      await newPage.close();
    });

    test("then GitHub link should open the correct URL", async ({
      page,
      context,
    }) => {
      const githubButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="GitHub"]') });

      const pagePromise = context.waitForEvent("page");
      await githubButton.click();
      const newPage = await pagePromise;

      await expect(newPage).toHaveURL(/github.com/);
      await newPage.close();
    });

    test("then Discord link should open the correct URL", async ({
      page,
      context,
    }) => {
      const discordButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="Discord"]') });

      const pagePromise = context.waitForEvent("page");
      await discordButton.click();
      const newPage = await pagePromise;

      await expect(newPage).toHaveURL(/discord.com/);
      await newPage.close();
    });
  });

  test.describe("when viewing the footer on mobile", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test("then all footer elements should be visible", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: /bartekj312@gmail.com/i }),
      ).toBeVisible();

      const instagramButton = page
        .locator("button")
        .filter({ has: page.locator('[aria-label*="Instagram"]') });
      await expect(instagramButton).toBeVisible();

      await expect(
        page.getByRole("button", { name: /back to top/i }),
      ).toBeVisible();
    });
  });
});
