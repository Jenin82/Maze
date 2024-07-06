import { useEffect, useState } from "react";
import { BackArrowsvg, HeartSvg } from "../../assets/svg";
import styles from "./index.module.css";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Nabvar } from "../../components/navbar";
import { Loader } from "../../components/loader";

export const LeaderboardProject = () => {
  const [data, setData] = useState<any[]>([]);
  const naviagte = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.rpc("get_idea_vote_diff");
    if (error) {
      toast.error(error.message);
      throw error;
    } else if (data) {
      setData(data);
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.Wrapper}>
      <button className={styles.back} onClick={() => naviagte("/home")}>
        <BackArrowsvg />
      </button>
      <h1>Idea Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Title</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.vote_diff}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.footer}>
        {" "}
        <p>Made with <HeartSvg /></p>
        <a href="https://fundesign.in" target="_blank">
          Fundesign
        </a>
      </div>
      <Nabvar />
    </div>
  );
};
