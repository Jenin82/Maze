import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { Topnav } from "../../../components/navbar/topnav";
import { Nabvar } from "../../../components/navbar";

import styles from "./index.module.css";
import { DisLikesvg, Likesvg, WhiteStarsvg } from "./svg";
import { Clicksvg } from "../../../assets/svg";
import { RoleCheckerFunction } from "../../../services/RoleChecker";
import { Roles } from "../../../services/Roles";
import { Searchsvg } from "../../../components/navbar/svg";
const IdeaList = () => {
  const [data, setData] = useState<Idea[]>([]);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user.id);
      let { data: idea, error: ideaError } = await supabase
        .from("idea")
        .select("*");
      if (ideaError) {
        toast.error(ideaError.message);
        throw ideaError.message;
      } else if (idea) {
        setData(idea);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Topnav />
      <div className={styles.Wrapper}>
        <div className={styles.Header}>
          {" "}
          <div>
            <h1 className={styles.infifty}>
              IN<span className="colorText">50</span>HRS
            </h1>
            <p>Bring your ideas into life!</p>
          </div>
          <RoleCheckerFunction roles={[Roles.IDEATOR]}>
            <button
              className={styles.buttonCreate}
              onClick={() => navigate("/idea-create")}
            >
              <WhiteStarsvg /> Create new idea
            </button>
          </RoleCheckerFunction>
        </div>
        <div className={styles.ideasWrapper}>
          <h2>MY IDEAS</h2>
          <div>
            {data.map((idea) => (
              <div>
                {idea.owner_id === user && (
                  <div key={idea.id} className={styles.IndividualSets}>
                    <div
                      onClick={() => {
                        navigate(`/idea/${idea.id}`);
                      }}
                    >
                      {" "}
                      <h3>{idea.title}</h3>
                      <p>{idea.description}</p>
                      <button>
                        See More <Clicksvg />
                      </button>
                    </div>
                    <div className={styles.Likes}>
                      <button>
                        <Likesvg color="#0098CA" />
                      </button>
                      <button>
                        <DisLikesvg color="#000" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.ideasWrapper}>
          <h2>EXPLORE IDEAS</h2>
          <div className={styles.SearchField}><Searchsvg /><input type="text" placeholder="Search ideas" value={search} onChange={(e) => setSearch(e.target.value)} /></div>

          <div>
            {data
              .filter(idea => {
                return (idea.title.toLowerCase().startsWith(search.toLowerCase()))
              })
              .map((idea) => (
                <>
                  {idea.owner_id !== user && (
                    <div key={idea.id} className={styles.IndividualSets}>
                      <div
                        onClick={() => {
                          navigate(`/idea/${idea.id}`);
                        }}
                      >
                        {" "}
                        <h3>{idea.title}</h3>
                        <p>{idea.description}</p>
                        <button>
                          See More <Clicksvg />
                        </button>
                      </div>
                      <div className={styles.Likes}>
                        <button>
                          <Likesvg color="#0098CA" />
                        </button>
                        <button>
                          <DisLikesvg color="#000" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
      <Nabvar />
    </>
  );
};

export default IdeaList;
