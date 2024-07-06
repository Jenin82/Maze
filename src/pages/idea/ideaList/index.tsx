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
import { Loader } from "../../../components/loader";

const IdeaList = () => {
  const [data, setData] = useState<Idea[]>([]);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        throw new Error(error.message);
      } else if (user) {
        setUser(user.id);
        const { data: idea, error: ideaError } = await supabase
          .from("idea")
          .select("*, idea_user_link(*)");
        if (ideaError) {
          throw new Error(ideaError.message);
        } else if (idea) {
          setData(idea);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVote = async (ideaId: string, voteType: "like" | "dislike") => {
    try {
      const { data: existingVote, error } = await supabase
        .from("idea_user_link")
        .select("*")
        .eq("user_id", user)
        .eq("idea_id", ideaId);

      if (error) {
        throw new Error(error.message);
      }

      if (existingVote && existingVote.length > 0) {
        // Update existing vote
        await supabase
          .from("idea_user_link")
          .update({ voted: voteType === "like" })
          .eq("id", existingVote[0].id);
      } else {
        // Insert nLoadingew vote
        await supabase.from("idea_user_link").insert({
          user_id: user,
          idea_id: ideaId,
          voted: voteType === "like",
        });
      }

      // Refresh data
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isVoted = (idea: Idea, voteType: "like" | "dislike") => {
    const userVote = idea.idea_user_link.find(
      (vote: { user_id: string }) => vote.user_id === user
    );
    return userVote ? userVote.voted === (voteType === "like") : false;
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Topnav />
      <div className={styles.Wrapper}>
        <div className={styles.Header}>
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
              <div key={idea.id}>
                {idea.owner_id === user && (
                  <div className={styles.IndividualSets}>
                    <div onClick={() => navigate(`/idea/${idea.id}`)}>
                      <h3>{idea.title}</h3>
                      <p>{idea.description}</p>
                      <button>
                        See More <Clicksvg />
                      </button>
                    </div>
                    <div className={styles.Likes}>
                      <button onClick={() => handleVote(idea.id, "like")}>
                        <Likesvg
                          color={isVoted(idea, "like") ? "#AAFF00" : "#000"}
                        />
                      </button>
                      <button onClick={() => handleVote(idea.id, "dislike")}>
                        <DisLikesvg
                          color={isVoted(idea, "dislike") ? "#FF0000" : "#000"}
                        />
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
          <div className={styles.SearchField}>
            <Searchsvg />
            <input
              type="text"
              placeholder="Search ideas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            {data
              .filter((idea) => {
                return idea.title
                  .toLowerCase()
                  .startsWith(search.toLowerCase());
              })
              .map((idea) => (
                <div key={idea.id}>
                  {idea.owner_id !== user && (
                    <div className={styles.IndividualSets}>
                      <div onClick={() => navigate(`/idea/${idea.id}`)}>
                        <h3>{idea.title}</h3>
                        <p>{idea.description}</p>
                        <button>
                          See More <Clicksvg />
                        </button>
                      </div>
                      <div className={styles.Likes}>
                        <button onClick={() => handleVote(idea.id, "like")}>
                          <Likesvg
                            color={isVoted(idea, "like") ? "#FE0000" : "#000"}
                          />
                        </button>
                        <button onClick={() => handleVote(idea.id, "dislike")}>
                          <DisLikesvg
                            color={
                              isVoted(idea, "dislike") ? "#FF0000" : "#000"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      <Nabvar />
    </>
  );
};

export default IdeaList;
