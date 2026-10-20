import {
  faDiscord,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import type { SocialLink } from "./Footer.types";

export const FOOTER_TEST_ID = "footer";
export const BACK_TO_TOP_TEST_ID = "back-to-top-button";
export const SOCIAL_LINKS_TEST_ID = "social-links";

export const DEFAULT_EMAIL = "bartekj312@gmail.com";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/_mont3ee/",
    icon: faInstagram,
    ariaLabel: "Visit my Instagram profile",
  },
  {
    name: "GitHub",
    url: "https://github.com/m0nt3ee",
    icon: faGithub,
    ariaLabel: "Visit my GitHub profile",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/520600896443514885",
    icon: faDiscord,
    ariaLabel: "Visit my Discord profile",
  },
];
