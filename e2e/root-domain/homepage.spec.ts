import { expect, test } from "@playwright/test";

test.describe("Portfolio Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("when viewing the hero section", () => {
    test("then they should see the portfolio owner's name", async ({
      page,
    }) => {
      await expect(
        page.getByRole("heading", { name: /BARTOSZ/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /JANICKI/i }),
      ).toBeVisible();
    });

    test("then they should see a scroll down button", async ({ page }) => {
      const scrollButton = page.getByRole("button", { name: /scroll down/i });
      await expect(scrollButton).toBeVisible();
    });
  });

  test.describe("when clicking the scroll down button", () => {
    test("then the page should scroll to the about section", async ({
      page,
    }) => {
      const scrollButton = page.getByRole("button", { name: /scroll down/i });
      await scrollButton.click({ force: true });

      await page.waitForTimeout(1000);

      const aboutHeading = page.getByRole("heading", { name: /ABOUT/i });
      await expect(aboutHeading).toBeInViewport();
    });
  });

  test.describe("when viewing the about section", () => {
    test("then they should see personal information", async ({ page }) => {
      await expect(page.getByRole("heading", { name: /ABOUT/i })).toBeVisible();
      await expect(
        page.getByText(/Hi, I'm Bartosz - a programming student/i),
      ).toBeVisible();
    });

    test("then they should see the profile picture", async ({ page }) => {
      const profileImage = page.getByAltText(/profile-picture/i);
      await expect(profileImage).toBeVisible();
    });

    test("then they should see the toolkit list", async ({ page }) => {
      await expect(page.getByText(/TOOLKIT/i)).toBeVisible();
      await expect(page.getByText(/React/i).first()).toBeVisible();
      await expect(page.getByText(/Typescript/i)).toBeVisible();
      await expect(page.getByText(/Tailwind CSS/i)).toBeVisible();
    });

    test("then they should see a link to Generacja Innowacja", async ({
      page,
    }) => {
      const giLink = page.getByRole("link", { name: /Generacja Innowacja/i });
      await expect(giLink).toBeVisible();
      await expect(giLink).toHaveAttribute("href", "https://gi.org.pl/");
    });
  });

  test.describe("when viewing the contact section", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/#contact");
    });

    test("then they should see the contact form", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /CONTACT/i }),
      ).toBeVisible();
      await expect(page.getByRole("textbox", { name: /name/i })).toBeVisible();
      await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: /subject/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: /message/i }),
      ).toBeVisible();
    });

    test("then they should see a send message button", async ({ page }) => {
      const sendButton = page.getByRole("button", { name: /send message/i });
      await expect(sendButton).toBeVisible();
    });
  });

  test.describe("when filling out the contact form", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/#contact");
    });

    test("then they should be able to enter their information", async ({
      page,
    }) => {
      const nameInput = page.getByRole("textbox", { name: /name/i });
      const emailInput = page.getByRole("textbox", { name: /email/i });
      const subjectInput = page.getByRole("textbox", { name: /subject/i });
      const messageInput = page.getByRole("textbox", { name: /message/i });

      await nameInput.fill("John Doe");
      await emailInput.fill("john.doe@example.com");
      await subjectInput.fill("Portfolio Inquiry");
      await messageInput.fill("Great portfolio! I'd like to connect.");

      await expect(nameInput).toHaveValue("John Doe");
      await expect(emailInput).toHaveValue("john.doe@example.com");
      await expect(subjectInput).toHaveValue("Portfolio Inquiry");
      await expect(messageInput).toHaveValue(
        "Great portfolio! I'd like to connect.",
      );
    });
  });
});
