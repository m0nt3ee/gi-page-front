import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";
import { BUTTON_TEST_ID } from "./Button.constants";

describe("<Button />", () => {
  describe("Given a Button component", () => {
    describe("when rendered with children", () => {
      it("then displays the children text", () => {
        render(<Button onClick={() => {}}>Click me</Button>);

        const button = screen.getByTestId(BUTTON_TEST_ID);

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Click me");
      });

      it("then has the correct button type", () => {
        render(<Button onClick={() => {}}>Click me</Button>);

        const button = screen.getByTestId(BUTTON_TEST_ID);

        expect(button).toHaveAttribute("type", "button");
      });
    });

    describe("when clicked", () => {
      it("then calls the onClick handler", () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByTestId(BUTTON_TEST_ID);
        button.click();

        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      it("then calls the onClick handler multiple times when clicked multiple times", () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByTestId(BUTTON_TEST_ID);
        button.click();
        button.click();
        button.click();

        expect(handleClick).toHaveBeenCalledTimes(3);
      });
    });

    describe("when isCTA prop is true", () => {
      it("then applies CTA styles", () => {
        render(
          <Button onClick={() => {}} isCTA>
            Contact Me
          </Button>,
        );

        const button = screen.getByTestId(BUTTON_TEST_ID);

        expect(button).toHaveClass("bg-blue-300");
        expect(button).toHaveClass("text-neutral-900");
      });
    });

    describe("when isCTA prop is false or not provided", () => {
      it("then does not apply CTA styles", () => {
        render(<Button onClick={() => {}}>Regular Button</Button>);

        const button = screen.getByTestId(BUTTON_TEST_ID);

        expect(button).not.toHaveClass("bg-blue-300");
        expect(button).toHaveClass("text-neutral-200");
      });
    });

    describe("when custom className is provided", () => {
      it("then merges custom classes with base classes", () => {
        render(
          <Button onClick={() => {}} className="custom-class w-full">
            Click me
          </Button>,
        );

        const button = screen.getByTestId(BUTTON_TEST_ID);

        expect(button).toHaveClass("custom-class");
        expect(button).toHaveClass("w-full");
        expect(button).toHaveClass("rounded-full");
      });
    });

    describe("when rendering with complex children", () => {
      it("then renders nested elements correctly", () => {
        render(
          <Button onClick={() => {}}>
            Home <span className="text-teal-400">Page</span>
          </Button>,
        );

        const button = screen.getByTestId(BUTTON_TEST_ID);
        const span = button.querySelector("span");

        expect(button).toHaveTextContent("Home Page");
        expect(span).toHaveClass("text-teal-400");
      });
    });
  });
});
