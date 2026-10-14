import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "./Navbar";
import { MOBILE_BREAKPOINT, NAVBAR_ROUTES } from "./Navbar.constants";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>,
  );
};

describe("<Navbar />", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Given a desktop viewport", () => {
    beforeEach(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    });

    describe("when the component renders", () => {
      it("then displays the logo button", () => {
        renderNavbar();

        const logoButton = screen.getByText(/BARTOSZ/i);

        expect(logoButton).toBeInTheDocument();
        expect(screen.getByText(/JANICKI/i)).toBeInTheDocument();
      });

      it("then displays all navigation links", () => {
        renderNavbar();

        for (const route of NAVBAR_ROUTES) {
          expect(screen.getByText(route.label)).toBeInTheDocument();
        }
      });

      it("then does not display the mobile menu toggle", () => {
        renderNavbar();

        const drawer = screen
          .queryByText("ABOUT")
          ?.closest("div")?.parentElement;
        expect(drawer).not.toHaveClass("absolute");
      });
    });

    describe("when clicking the logo button", () => {
      it("then navigates to home", () => {
        renderNavbar();

        const logoButton = screen.getByText(/BARTOSZ/i);
        fireEvent.click(logoButton);

        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    describe("when clicking a navigation link", () => {
      it("then navigates to the correct route", () => {
        renderNavbar();

        const aboutButton = screen.getByText("ABOUT");
        fireEvent.click(aboutButton);

        expect(mockNavigate).toHaveBeenCalledWith("/about");
      });
    });

    describe("when clicking the CTA button", () => {
      it("then navigates to contact page", () => {
        renderNavbar();

        const ctaButton = screen.getByText("CONTACT ME");
        fireEvent.click(ctaButton);

        expect(mockNavigate).toHaveBeenCalledWith("/contact");
      });
    });
  });

  describe("Given a mobile viewport", () => {
    beforeEach(() => {
      window.innerWidth = MOBILE_BREAKPOINT - 1;
      window.dispatchEvent(new Event("resize"));
    });

    describe("when the component renders", () => {
      it("then displays the mobile menu toggle button", () => {
        renderNavbar();

        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(1);
      });

      it("then does not display navigation links initially", () => {
        renderNavbar();

        const aboutButtons = screen.queryAllByText("ABOUT");
        expect(aboutButtons.length).toBe(0);
      });

      it("then drawer is closed by default", () => {
        renderNavbar();

        const drawer = screen.queryByRole("button", { name: "ABOUT" });
        expect(drawer).not.toBeInTheDocument();
      });
    });

    describe("when clicking the mobile menu toggle", () => {
      it("then opens the drawer", async () => {
        renderNavbar();

        const buttons = screen.getAllByRole("button");
        const hamburgerButton = buttons[buttons.length - 1];

        fireEvent.click(hamburgerButton);

        await waitFor(() => {
          expect(screen.getByText("ABOUT")).toBeInTheDocument();
        });
      });

      it("then displays all navigation links in drawer", async () => {
        renderNavbar();

        const buttons = screen.getAllByRole("button");
        const hamburgerButton = buttons[buttons.length - 1];

        fireEvent.click(hamburgerButton);

        await waitFor(() => {
          for (const route of NAVBAR_ROUTES) {
            expect(screen.getByText(route.label)).toBeInTheDocument();
          }
        });
      });
    });

    describe("when the drawer is open", () => {
      it("then closes the drawer when clicking toggle again", async () => {
        renderNavbar();

        const buttons = screen.getAllByRole("button");
        const hamburgerButton = buttons[buttons.length - 1];

        fireEvent.click(hamburgerButton);
        await waitFor(() => {
          expect(screen.getByText("ABOUT")).toBeInTheDocument();
        });

        fireEvent.click(hamburgerButton);
        await waitFor(() => {
          expect(screen.queryByText("ABOUT")).not.toBeInTheDocument();
        });
      });

      it("then closes drawer and navigates when clicking a link", async () => {
        renderNavbar();

        const buttons = screen.getAllByRole("button");
        const hamburgerButton = buttons[buttons.length - 1];

        fireEvent.click(hamburgerButton);
        await waitFor(() => {
          expect(screen.getByText("BLOG")).toBeInTheDocument();
        });

        const blogButton = screen.getByText("BLOG");
        fireEvent.click(blogButton);

        expect(mockNavigate).toHaveBeenCalledWith("/blog");
      });
    });
  });

  describe("Given a viewport resize", () => {
    describe("when resizing from desktop to mobile", () => {
      it("then switches to mobile layout", async () => {
        window.innerWidth = 1024;
        renderNavbar();

        expect(screen.getByText("ABOUT")).toBeInTheDocument();

        window.innerWidth = MOBILE_BREAKPOINT - 1;
        window.dispatchEvent(new Event("resize"));

        await waitFor(() => {
          const aboutElements = screen.queryAllByText("ABOUT");
          expect(aboutElements.length).toBe(0);
        });
      });
    });

    describe("when resizing from mobile to desktop", () => {
      it("then switches to desktop layout", async () => {
        window.innerWidth = MOBILE_BREAKPOINT - 1;
        renderNavbar();

        window.innerWidth = 1024;
        window.dispatchEvent(new Event("resize"));

        await waitFor(() => {
          expect(screen.getByText("ABOUT")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Given cleanup on unmount", () => {
    describe("when component unmounts", () => {
      it("then removes resize event listener", () => {
        const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

        const { unmount } = renderNavbar();
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          "resize",
          expect.any(Function),
        );

        removeEventListenerSpy.mockRestore();
      });
    });
  });
});
