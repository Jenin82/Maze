import styles from "./index.module.css";

type Props = {};

export const Loader = (_props: Props) => {
  return (
    <div className={styles.Wrapper}>
    
      <p className={styles.loader}></p>
    </div>
  );
};
