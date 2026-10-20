import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Footer from "./Footer";
import {
  BACK_TO_TOP_TEST_ID,
  DEFAULT_EMAIL,
  FOOTER_TEST_ID,
  SOCIAL_LINKS,
  SOCIAL_LINKS_TEST_ID,
} from "./Footer.constants";

describe("<Footer />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Given a Footer component", () => {
    describe("when rendered without props", () => {
      it("then displays the default email", () => {
        render(<Footer />);

        const emailLink = screen.getByText(DEFAULT_EMAIL);

        expect(emailLink).toBeInTheDocument();
        expect(emailLink).toHaveAttribute("href", `mailto:${DEFAULT_EMAIL}`);
      });

      it("then displays all social links", () => {
        render(<Footer />);

        const socialContainer = screen.getByTestId(SOCIAL_LINKS_TEST_ID);
        const buttons = socialContainer.querySelectorAll("button");

        expect(buttons).toHaveLength(SOCIAL_LINKS.length);
      });

      it("then displays back to top button", () => {
        render(<Footer />);

        const backToTopButton = screen.getByTestId(BACK_TO_TOP_TEST_ID);

        expect(backToTopButton).toBeInTheDocument();
        expect(backToTopButton).toHaveTextContent(/Back to Top/i);
      });

      it("then renders the footer element", () => {
        render(<Footer />);

        const footer = screen.getByTestId(FOOTER_TEST_ID);

        expect(footer).toBeInTheDocument();
        expect(footer.tagName).toBe("FOOTER");
      });
    });

    describe("when rendered with custom email", () => {
      it("then displays the custom email", () => {
        const customEmail = "custom@example.com";
        render(<Footer email={customEmail} />);

        const emailLink = screen.getByText(customEmail);

        expect(emailLink).toBeInTheDocument();
        expect(emailLink).toHaveAttribute("href", `mailto:${customEmail}`);
      });
    });

    describe("when clicking the email link", () => {
      it("then has correct mailto href", () => {
        render(<Footer />);

        const emailLink = screen.getByText(DEFAULT_EMAIL);

        expect(emailLink).toHaveAttribute("href", `mailto:${DEFAULT_EMAIL}`);
      });
    });

    describe("when clicking back to top button", () => {
      it("then scrolls to top of page", () => {
        const scrollToSpy = vi.fn();
        window.scrollTo = scrollToSpy;

        render(<Footer />);

        const backToTopButton = screen.getByTestId(BACK_TO_TOP_TEST_ID);
        fireEvent.click(backToTopButton);

        expect(scrollToSpy).toHaveBeenCalledWith({
          top: 0,
          behavior: "smooth",
        });
      });
    });

    describe("when clicking a social link button", () => {
      it("then opens the social link in new tab", () => {
        const windowOpenSpy = vi
          .spyOn(window, "open")
          .mockImplementation(() => null);

        render(<Footer />);

        const socialContainer = screen.getByTestId(SOCIAL_LINKS_TEST_ID);
        const buttons = socialContainer.querySelectorAll("button");

        fireEvent.click(buttons[0]);

        expect(windowOpenSpy).toHaveBeenCalledWith(
          SOCIAL_LINKS[0].url,
          "_blank",
          "noopener,noreferrer",
        );

        windowOpenSpy.mockRestore();
      });

      it("then opens correct url for each social link", () => {
        const windowOpenSpy = vi
          .spyOn(window, "open")
          .mockImplementation(() => null);

        render(<Footer />);

        const socialContainer = screen.getByTestId(SOCIAL_LINKS_TEST_ID);
        const buttons = socialContainer.querySelectorAll("button");

        for (let i = 0; i < SOCIAL_LINKS.length; i++) {
          fireEvent.click(buttons[i]);

          expect(windowOpenSpy).toHaveBeenCalledWith(
            SOCIAL_LINKS[i].url,
            "_blank",
            "noopener,noreferrer",
          );
        }

        windowOpenSpy.mockRestore();
      });
    });

    describe("when checking accessibility", () => {
      it("then social icons have aria-labels", () => {
        render(<Footer />);

        for (const social of SOCIAL_LINKS) {
          const icon = screen.getByLabelText(social.ariaLabel);
          expect(icon).toBeInTheDocument();
        }
      });
    });

    describe("when checking responsive layout", () => {
      it("then has responsive flex classes", () => {
        render(<Footer />);

        const footer = screen.getByTestId(FOOTER_TEST_ID);
        const container = footer.querySelector("div");

        expect(container).toHaveClass("flex");
        expect(container).toHaveClass("flex-col");
        expect(container).toHaveClass("md:flex-row");
      });
    });
  });
});
