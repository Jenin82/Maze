import { useState, useEffect } from "react";
import styles from "./navbar.module.css";

import { Logosvg } from "./svg";
import { useNavigate } from "react-router-dom";
import { useReactPath } from "./path.hook";

type Props = {};

// type NavItem = {
//   path: string;
//   Icon: React.ElementType;
// };

export const Topnav = (_props: Props) => {
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [navStyle, setNavStyle] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setNavStyle({
          position: "fixed",
          top: 0,
          width: "100%",
        });
      } else {
        setNavStyle({
          position: "static",
        });
      }

      if (window.scrollY == 0) {
        setNavStyle({
          position: "static",
        });
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navigate = useNavigate();

  const handleNavigation = (value: string) => {
    navigate(value);
  };
  const path = useReactPath();

  // const navItems: NavItem[] = [{ path: "/notification", Icon: Notifisvg }];

  useEffect(() => {}, [path]);

  // const renderNavButton = ({ path, Icon }: NavItem) => (
  //   <button onClick={() => handleNavigation(path)}>
  //     <Icon color={window.location.href.includes(path) ? "#210535" : "#fff"} />
  //   </button>
  // );
  return (
    <div style={navStyle} className={styles.TopnavWrapper}>
      <button onClick={() => handleNavigation("/home")}>
        <Logosvg />
      </button>
      {/* {navItems.map((item) => renderNavButton(item))} */}
    </div>
  );
};
