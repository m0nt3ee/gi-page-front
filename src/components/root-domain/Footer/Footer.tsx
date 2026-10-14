import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../shared/Button/Button";
import {
  BACK_TO_TOP_TEST_ID,
  DEFAULT_EMAIL,
  FOOTER_TEST_ID,
  SOCIAL_LINKS,
  SOCIAL_LINKS_TEST_ID,
} from "./Footer.constants";
import type { FooterProps } from "./Footer.types";

const Footer = ({ email = DEFAULT_EMAIL }: FooterProps) => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer
      className="bg-black border-t border-neutral-800 px-8 md:px-16 py-8"
      data-testid={FOOTER_TEST_ID}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Email */}
        <div className="text-neutral-400 font-(family-name:--font-family-jetbrains) text-sm order-2 md:order-1">
          <a
            href={`mailto:${email}`}
            className="hover:text-teal-400 transition-colors underline"
          >
            {email}
          </a>
        </div>

        {/* Center: Social Links */}
        <div
          className="flex gap-4 order-1 md:order-2"
          data-testid={SOCIAL_LINKS_TEST_ID}
        >
          {SOCIAL_LINKS.map((social) => (
            <Button
              key={social.name}
              onClick={() => handleSocialClick(social.url)}
              className="h-10 w-10 flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={social.icon}
                className="text-neutral-300 text-lg"
                aria-label={social.ariaLabel}
              />
            </Button>
          ))}
        </div>

        {/* Right: Back to Top */}
        <div className="order-3">
          <Button onClick={handleBackToTop} className="h-10 px-4">
            <span
              className="flex items-center gap-2"
              data-testid={BACK_TO_TOP_TEST_ID}
            >
              <span className="text-neutral-300 text-sm uppercase tracking-wider">
                Back to Top
              </span>
              <FontAwesomeIcon icon={faArrowUp} className="text-neutral-300" />
            </span>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
