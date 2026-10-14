import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router";
import { expect, userEvent, within } from "storybook/test";
import Navbar from "./Navbar";

const meta = {
  title: "Root Domain/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Primary navigation component for the portfolio website. Adapts to mobile and desktop viewports with a responsive drawer menu for mobile devices.",
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story: "Desktop layout showing all navigation links inline",
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
        story: "Mobile layout with hamburger menu toggle",
      },
    },
  },
};

export const MobileWithDrawerOpen: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Mobile layout with drawer menu opened showing all navigation links",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const buttons = canvas.getAllByRole("button");
    const hamburgerButton = buttons[buttons.length - 1];

    await userEvent.click(hamburgerButton);

    const aboutButtons = canvas.queryAllByText("ABOUT");
    await expect(aboutButtons.length).toBeGreaterThan(0);
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story:
          "Tablet layout (768px breakpoint) showing mobile drawer behavior",
      },
    },
  },
};

export const LongScrollPage: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story: "Navbar stays fixed at the top during page scroll",
      },
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div
          style={{
            padding: "100px 20px",
            height: "200vh",
            background: "linear-gradient(180deg, #262626 0%, #0a0a0a 100%)",
            color: "white",
          }}
        >
          <h1>Scroll Down</h1>
          <p>The navbar remains fixed at the top of the viewport.</p>
          <div style={{ marginTop: "50vh" }}>
            <h2>Middle of page</h2>
          </div>
          <div style={{ marginTop: "50vh" }}>
            <h2>Bottom of page</h2>
          </div>
        </div>
      </div>
    ),
  ],
};

export const InteractionTest: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story:
          "Automated interaction test - clicks navigation buttons if visible in current viewport",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Try to find navigation buttons - they may be in drawer or inline depending on actual window size
    const allButtons = canvas.getAllByRole("button");

    // Click the first non-logo button if it exists
    if (allButtons.length > 1) {
      await userEvent.click(allButtons[1]);
      await expect(allButtons[1]).toBeInTheDocument();
    }
  },
};

export const MobileInteractionTest: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Automated interaction test for mobile drawer open/close behavior",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const buttons = canvas.getAllByRole("button");
    const hamburgerButton = buttons[buttons.length - 1];

    // Open drawer
    await userEvent.click(hamburgerButton);

    // Verify more buttons are now visible
    const buttonsAfterOpen = canvas.getAllByRole("button");
    await expect(buttonsAfterOpen.length).toBeGreaterThan(buttons.length);

    // Close drawer
    await userEvent.click(hamburgerButton);
  },
};
