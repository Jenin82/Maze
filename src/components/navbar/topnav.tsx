import { useEffect } from "react";
import styles from "./navbar.module.css";

import { Logosvg } from "./svg";
import { useNavigate } from "react-router-dom";
import { useReactPath } from "./path.hook";

type Props = {};

export const Topnav = (_props: Props) => {
  const navigate = useNavigate();

  const handleNavigation = (value: string) => {
    navigate(value);
  };
  const path = useReactPath();

  useEffect(() => {}, [path]);

  return (
    <div className={styles.TopnavWrapper}>
      <button onClick={() => handleNavigation("/home")}>
        <Logosvg />
      </button>
    </div>
  );
};
