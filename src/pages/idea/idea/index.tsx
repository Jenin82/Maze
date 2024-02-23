import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

import styles from "./index.module.css";
import { Topnav } from "../../../components/navbar/topnav";
import { Nabvar } from "../../../components/navbar";
import { Crosssvg, Ticksvg } from "./svg";

const Idea = () => {
  const { id } = useParams();
  const [data, setData] = useState<Idea>();
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [ideaData, setIdeaData] = useState<IdeaUserLink[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user.id);
      let { data: idea, error: ideaError } = await supabase
        .from("idea")
        .select("*, users(name)")
        .eq("id", id)
        .single();
      if (ideaError) {
        toast.error(ideaError.message);
        throw ideaError.message;
      } else if (idea) {
        setData(idea as unknown as Idea);
        let { data: ideUserLink, error: ideaUserLinkError } = await supabase
          .from("idea_user_link")
          .select("*, users(name)")
          .eq("idea_id", id);
        if (ideaUserLinkError) {
          throw ideaUserLinkError.message;
        } else if (ideUserLink && ideUserLink.length > 0) {
          setIdeaData(ideUserLink);
        }
        let { data: idea_user_link, error } = await supabase
          .from("idea_user_link")
          .select("status")
          .eq("idea_id", id)
          .eq("user_id", user.id);
        if (error) {
          throw error.message;
        } else if (idea_user_link && idea_user_link.length > 0) {
          setStatus(idea_user_link[0].status);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const req: string[] = JSON.parse(data?.requirements || "[]");

  const requestContribute = async () => {
    const { data: res, error: contributeError } = await supabase
      .from("idea_user_link")
      .insert([{ idea_id: id, user_id: user, status: "requested" }])
      .select();
    if (contributeError) {
      if (contributeError.message.includes("duplicate key")) {
        throw "Request already sent";
      } else {
        throw contributeError.message;
      }
    } else if (res) {
      return res;
    }
  };

  const handleContribute = async () => {
    toast.promise(requestContribute(), {
      loading: "Requesting...",
      success: () => {
        setStatus("requested");
        setRefresh(!refresh);
        return <b>Request sent</b>;
      },
      error: (error) => {
        return <b>{error}</b>;
      },
    });
  };

  const handleAccept = async (ideaUserLink: IdeaUserLink) => {
    const { data, error } = await supabase
      .from("idea_user_link")
      .update({
        id: ideaUserLink.id,
        idea_id: ideaUserLink.idea_id,
        user_id: ideaUserLink.user_id,
        status: "accepted",
      })
      .eq("user_id", ideaUserLink.user_id)
      .eq("idea_id", ideaUserLink.idea_id)
      .select();
    if (error) {
      toast.error(error.message);
      throw error.message;
    } else if (data) {
      setStatus("accepted");
      setRefresh(!refresh);
      return data;
    }
  };

  const handleDecline = async (ideaUserLink: IdeaUserLink) => {
    const { data, error } = await supabase
      .from("idea_user_link")
      .update({
        id: ideaUserLink.id,
        idea_id: ideaUserLink.idea_id,
        user_id: ideaUserLink.user_id,
        status: "rejected",
      })
      .eq("user_id", ideaUserLink.user_id)
      .eq("idea_id", ideaUserLink.idea_id)
      .select();
    if (error) {
      toast.error(error.message);
      throw error.message;
    } else if (data) {
      setStatus("accepted");
      setRefresh(!refresh);
      return data;
    }
  };

  return (
    <>
      <Topnav />
      {data && ideaData && (
        <div className={styles.Wrapper}>
          <div>
            {" "}
            <h1>Title : {data.title}</h1>
            <h2>By : {data.users.name}</h2>
          </div>
          <div>
            Description:
            <br />
            {data.description}
          </div>
          <div className={styles.Requirement}>
            <h2>Requirements</h2>
            <div>
              {req.map((requirement, index) => (
                <p key={index}>{requirement}</p>
              ))}
            </div>
          </div>
          <div className={styles.Requirement}>
            <h2>Contributors</h2>
            <div>
              {" "}
              {ideaData.map(
                (ideaUserLink, index) =>
                  ideaUserLink.status === "accepted" && (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(`/profile/${ideaUserLink.user_id}`)
                      }
                    >
                      <img
                        src={
                          "https://mlwspjsnmivgrddhviyc.supabase.co/storage/v1/object/public/avatar/avatar_" +
                          ideaUserLink.user_id +
                          ".jpeg"
                        }
                        alt={ideaUserLink.users.name}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
          {data.owner_id === user ? (
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              <h2>Requested Contributors</h2>
              {ideaData.map(
                (ideaUserLink, index) =>
                  ideaUserLink.status === "requested" && (
                    <div key={index} className={styles.AddUserForm}>
                      <img src="" alt="" />
                      <h3>{ideaUserLink.users.name}</h3>
                      <div className={styles.ButtonContainer}>
                   
                        <button onClick={() => handleAccept(ideaUserLink)}>
                          <Ticksvg />
                        </button>
                        <button onClick={() => handleDecline(ideaUserLink)}>
                          <Crosssvg />
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div>
              {status === "requested" ? (
                <div>Requested</div>
              ) : status === "rejected" ? (
                <div>Ideator rejected your request</div>
              ) : status === "accepted" ? (
                <div></div>
              ) : (
                <div>
                  <button onClick={handleContribute}>Contribute</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <Nabvar />
    </>
  );
};

export default Idea;
