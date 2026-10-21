import { expect, test } from "@playwright/test";

test.describe("Navbar Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("when viewing the navbar", () => {
    test("then they should see the logo with portfolio owner's name", async ({
      page,
    }) => {
      const homeButton = page.getByRole("button", {
        name: /BARTOSZ JANICKI/i,
      });
      await expect(homeButton).toBeVisible();
    });

    test("then they should see all navigation links on desktop", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      await expect(
        page.getByRole("button", { name: /^ABOUT$/i }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: /^BLOG$/i })).toBeVisible();
      await expect(
        page.getByRole("button", { name: /CONTACT ME/i }),
      ).toBeVisible();
    });

    test("then they should see a hamburger menu on mobile", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(
        page.getByRole("button", { name: /^ABOUT$/i }),
      ).not.toBeVisible();

      const menuButton = page.locator("nav button").last();
      await expect(menuButton).toBeVisible();
    });
  });

  test.describe("when clicking the logo", () => {
    test("then they should navigate to the homepage", async ({ page }) => {
      await page.goto("/blog");

      const homeButton = page.getByRole("button", {
        name: /BARTOSZ JANICKI/i,
      });
      await homeButton.click();

      await expect(page).toHaveURL("/");
    });
  });

  test.describe("when clicking the ABOUT link", () => {
    test("then they should scroll to the about section on desktop", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      const aboutButton = page.getByRole("button", { name: /^ABOUT$/i });
      await aboutButton.click();

      await page.waitForTimeout(1000);

      const aboutSection = page.locator("#about-me");
      await expect(aboutSection).toBeInViewport();
    });
  });

  test.describe("when clicking the CONTACT ME link", () => {
    test("then they should scroll to the contact section from homepage", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      const contactButton = page.getByRole("button", { name: /CONTACT ME/i });
      await contactButton.click();

      await page.waitForTimeout(500);

      await expect(page).toHaveURL("/contact");
    });
  });

  test.describe("when using the mobile navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test("then they should be able to open the navigation drawer", async ({
      page,
    }) => {
      const menuButton = page.locator("nav button").last();
      await menuButton.click();

      await expect(
        page.getByRole("button", { name: /^ABOUT$/i }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: /^BLOG$/i })).toBeVisible();
      await expect(
        page.getByRole("button", { name: /CONTACT ME/i }),
      ).toBeVisible();
    });

    test("then they should be able to navigate using drawer options", async ({
      page,
    }) => {
      const menuButton = page.locator("nav button").last();
      await menuButton.click();

      const aboutButton = page.getByRole("button", { name: /^ABOUT$/i });
      await aboutButton.click();

      await page.waitForTimeout(1000);

      const aboutSection = page.locator("#about-me");
      await expect(aboutSection).toBeInViewport();

      await expect(aboutButton).not.toBeVisible();
    });
  });

  test.describe("when navigating to different routes", () => {
    test("then they should be able to navigate to the blog page", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      const blogButton = page.getByRole("button", { name: /^BLOG$/i });
      await blogButton.click();

      await expect(page).toHaveURL("/blog");
    });
  });
});
