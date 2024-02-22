import { Clicksvg } from "../../assets/svg";
import { Nabvar } from "../../components/navbar";
import { Topnav } from "../../components/navbar/topnav";

import styles from "./index.module.css";

import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const Home = () => {
  return (
    <div className={styles.Wrapper}>
      <Topnav />
      <div className={styles.participants}>
        <h1>Participants</h1>
        <div className={styles.InnerWrapper}>
          <div className={styles.Individual}>
            <img src="" alt="" />
            <div className={styles.headerset}>
              <h2>Amal C P</h2>
              <h3>Frontend Developer</h3>
              <button>
                See More <Clicksvg />
              </button>
            </div>
            <div className={styles.upward}>
              <div className={styles.up}>
                <p>10</p>
                <IoIosArrowUp />
              </div>
              <div className={styles.down}>
                <p>5</p>
                <IoIosArrowDown />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Nabvar />
    </div>
  );
};

export default Home;
