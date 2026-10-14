import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../shared/Button/Button";
import { MOBILE_BREAKPOINT, NAVBAR_ROUTES } from "./Navbar.constants.ts";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className="flex flex-row justify-between p-3 fixed w-full z-50 bg-neutral-900 backdrop-blur-sm">
      <Button onClick={() => handleNavigate("/")}>
        BARTOSZ <span className="text-teal-300">JANICKI</span>
      </Button>

      {!isMobile ? (
        <div className="flex flex-row gap-5">
          {NAVBAR_ROUTES.map((route) => (
            <Button
              key={route.path}
              onClick={() => handleNavigate(route.path)}
              isCTA={route.isCTA}
            >
              {route.label}
            </Button>
          ))}
        </div>
      ) : (
        <div className="h-10">
          <Button onClick={toggleDrawer} className="h-10 w-10">
            <FontAwesomeIcon icon={faBars} className="text-neutral-300" />
          </Button>

          {isDrawerOpen && (
            <div className="absolute left-0 top-full flex flex-col items-center w-screen bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-lg">
              {NAVBAR_ROUTES.map((route) => (
                <Button
                  key={route.path}
                  onClick={() => handleNavigate(route.path)}
                  isCTA={route.isCTA}
                  className="w-36 my-2 h-12"
                >
                  {route.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
