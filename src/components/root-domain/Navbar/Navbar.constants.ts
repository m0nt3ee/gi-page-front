import type { NavbarRoute } from "./Navbar.types.ts";

export const MOBILE_BREAKPOINT = 768;

export const NAVBAR_ROUTES: NavbarRoute[] = [
  {
    path: "/",
    label: "ABOUT",
    isCTA: false,
    scrollTo: "about-me",
  },
  {
    path: "/blog",
    label: "BLOG",
    isCTA: false,
  },
  {
    path: "/contact",
    label: "CONTACT ME",
    isCTA: true,
  },
];

export const NAVBAR_TEST_ID = "navbar";
export const NAVBAR_DRAWER_TEST_ID = "navbar-drawer";
export const NAVBAR_TOGGLE_TEST_ID = "navbar-toggle";
