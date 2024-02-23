import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
const Welcome = () => {

  const navigate = useNavigate()

  const handle = ()=>{
    navigate('/home')
  }
  return (
    <div className={styles.Wrapper}>
      <button onClick={handle}>Get Started</button>
    </div>
  );
};

export default Welcome;
