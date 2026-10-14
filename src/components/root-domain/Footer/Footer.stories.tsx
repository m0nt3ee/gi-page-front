import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import Footer from "./Footer";

const meta = {
  title: "Root Domain/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Footer component displaying email contact, social media links, and a back-to-top button. Responsive layout that adapts to mobile and desktop viewports.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default footer with email, social links, and back to top button",
      },
    },
  },
};

export const CustomEmail: Story = {
  args: {
    email: "custom@example.com",
  },
  parameters: {
    docs: {
      description: {
        story: "Footer with custom email address",
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile layout with stacked elements",
      },
    },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story: "Desktop layout with horizontal alignment",
      },
    },
  },
};

export const WithLongPage: Story = {
  decorators: [
    (Story) => (
      <div>
        <div className="min-h-[200vh] bg-gradient-to-b from-neutral-900 to-neutral-950 p-8">
          <h1 className="text-white text-4xl">Scroll Down</h1>
          <p className="text-neutral-400 mt-4">
            Scroll to the bottom to see the footer and test the back to top
            button.
          </p>
          <div className="h-[150vh]" />
          <p className="text-neutral-400">Almost at the footer...</p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Footer at the bottom of a long page. Test the back to top button functionality.",
      },
    },
  },
};

export const InteractionTest: Story = {
  parameters: {
    docs: {
      description: {
        story: "Automated interaction test - clicks social buttons and email",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check email link exists
    const emailLink = canvas.getByText(/bartekj312@gmail.com/i);
    await expect(emailLink).toBeInTheDocument();

    // Check back to top button
    const backToTopButton = canvas.getByText(/Back to Top/i);
    await expect(backToTopButton).toBeInTheDocument();

    // Click back to top
    await userEvent.click(backToTopButton);

    // Check all social buttons exist
    const buttons = canvas.getAllByRole("button");
    await expect(buttons.length).toBeGreaterThan(1);
  },
};
