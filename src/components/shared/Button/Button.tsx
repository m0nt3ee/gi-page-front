import { twMerge } from "tailwind-merge";
import { BUTTON_TEST_ID } from "./Button.constants";
import type { ButtonProps } from "./Button.types.ts";

const Button = ({
  children,
  onClick,
  className,
  isCTA = false,
}: ButtonProps) => {
  const baseStyles =
    "p-1 px-3 rounded-full text-neutral-200 hover:bg-neutral-700 cursor-pointer font-(family-name:--font-family-jetbrains) text-sm transition-colors";
  const ctaStyles = isCTA
    ? "bg-blue-300 text-neutral-900 hover:bg-blue-400"
    : "";

  return (
    <button
      onClick={onClick}
      className={twMerge(baseStyles, ctaStyles, className)}
      data-testid={BUTTON_TEST_ID}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
