import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Topnav } from "../../../components/navbar/topnav";
import { Nabvar } from "../../../components/navbar";

import styles from "./index.module.css";
import { GitHubsvg, LinkedInsvg, Twittersvg } from "./svg";

import { CiEdit } from "react-icons/ci";

const Profile = () => {
  const [pic, setPic] = useState("");
  const [data, setData] = useState<ProfileCreate>({
    id: "",
    name: "",
    email: "",
    bio: "",
    skills: [],
    projects: [],
    linkedin: "",
    github: "",
    x: "",
    muid: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = supabase.storage
        .from("avatar")
        .getPublicUrl(`avatar_${user.id}.jpeg?timestamp=${Date.now()}`);
      if (data.publicUrl) {
        setPic(data.publicUrl);
        if (id) {
          let { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id);
          if (error) {
            toast.error(error.message);
            throw error.message;
          } else if (users) {
            setData(users[0]);
            return users[0];
          }
        } else {
          let { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id);
          if (error) {
            toast.error(error.message);
            throw error.message;
          } else if (users) {
            setData(users[0]);
            return users[0];
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Topnav />
      {pic && data && (
        <div className={styles.Wrapper}>
          <img
            style={{
              width: "130px",
              height: "130px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={pic}
            alt="test"
          />
          <div className={styles.Details}>
            {" "}
            <h2>{data.name}</h2>
            <p>{data.bio}</p>
            <h3>IDEATOR</h3>
          </div>
          <div className={styles.SkillsWrapp}>
            {data.skills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
          </div>
          <div className={styles.ButtonWrapper}>
            <a href={data.linkedin}>
              <LinkedInsvg color={data.linkedin ? "#0098CA" : "#A0A5BA"} />
            </a>
            <a href={data.x}>
              <Twittersvg color={data.x ? "#0098CA" : "#A0A5BA"} />
            </a>
            <a href={data.github}>
              <GitHubsvg color={data.github ? "#0098CA" : "#A0A5BA"} />
            </a>
          </div>
          <div
            onClick={() => {
              supabase.auth.signOut();
              localStorage.clear();
              navigate("/signin");
            }}
            className={styles.Logout}
          >
            Logout
          </div>{" "}
          <button
            style={{
              backgroundColor: "#0098CA",
              position: "absolute",
              right: "10%",
              fontSize: "40px",
              borderRadius: "10px",
            }}
          >
            <CiEdit />
          </button>
        </div>
      )}

      <Nabvar />
    </>
  );
};

export default Profile;
