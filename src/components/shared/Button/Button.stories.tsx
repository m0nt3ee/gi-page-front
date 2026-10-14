import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
  title: "Shared/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile button component with support for regular and CTA (Call-to-Action) styles. Uses JetBrains Mono font and follows the project's design system.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Button content (text or React nodes)",
    },
    onClick: {
      description: "Click handler function",
      action: "clicked",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to merge with base styles",
    },
    isCTA: {
      control: "boolean",
      description: "Enable Call-to-Action styling (blue background)",
    },
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    isCTA: false,
  },
};

export const CallToAction: Story = {
  args: {
    children: "Contact Me",
    isCTA: true,
  },
  parameters: {
    docs: {
      description: {
        story: "CTA variant with blue background for primary actions",
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        BARTOSZ <span className="text-teal-300">JANICKI</span>
      </>
    ),
    isCTA: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Button with nested styled elements",
      },
    },
  },
};

export const Navigation: Story = {
  args: {
    children: "ABOUT",
    isCTA: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Regular button used for navigation",
      },
    },
  },
};

export const CustomWidth: Story = {
  args: {
    children: "Wide Button",
    className: "w-48",
    isCTA: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Button with custom width applied via className prop",
      },
    },
  },
};

export const LongText: Story = {
  args: {
    children: "This is a button with longer text content",
    isCTA: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Button handling longer text content",
      },
    },
  },
};

export const MobileMenu: Story = {
  args: {
    children: "☰",
    className: "h-10 w-10",
    isCTA: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Button styled for mobile menu toggle (square shape)",
      },
    },
  },
};
