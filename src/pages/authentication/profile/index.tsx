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
  const [data, setData] = useState<ProfileData>();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isValidImage, setIsValidImage] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [userID, setUserID] = useState("");

  const fetchData = async () => {
    const user = await supabase.auth.getSession();
    if (user) {
      setUserID(user.data.session?.user.id!);
      if (id) {
        let { data: users, error } = await supabase
          .from("users")
          .select("*, user_role_link(*,roles(*))")
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
          .select("*, user_role_link(*,roles(*))")
          .eq("id", user.data.session?.user.id);
        if (error) {
          toast.error(error.message);
          throw error.message;
        } else if (users) {
          setData(users[0]);
          return users[0];
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const { data } = supabase.storage
      .from("avatar")
      .getPublicUrl(
        `avatar_${id ? id : userID}.webp?timestamp=${Date.now()}`
      );
    const imageUrl = data?.publicUrl;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      console.log("Image loaded successfully");
      setIsValidImage(true);
      setImageSrc(imageUrl);
    };
    img.onerror = () => {
      setIsValidImage(false);
    };
  }, [data]);

  return (
    <>
      <Topnav />
      {data && (
        <div className={styles.Wrapper}>
          <img
            style={{
              width: "130px",
              height: "130px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={
              isValidImage
                ? imageSrc
                : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
            }
            alt="Profile image"
          />

          <div className={styles.Details}>
            {" "}
            <h2>{data.name}</h2>
            <p>{data.bio}</p>
            <h3>{data.user_role_link.roles.name}</h3>
          </div>
          <div className={styles.SkillsWrapp}>
            {data.skills.map((skill, index) => (
              <div key={index}>{skill}</div>
            ))}
          </div>
          <div className={styles.ButtonWrapper}>
            <a href={data.linkedin}>
              <LinkedInsvg color={data.linkedin ? "#FE0000" : "#A0A5BA"} />
            </a>
            <a href={data.x}>
              <Twittersvg color={data.x ? "#FE0000" : "#A0A5BA"} />
            </a>
            <a href={data.github}>
              <GitHubsvg color={data.github ? "#FE0000" : "#A0A5BA"} />
            </a>
          </div>
          {!id && (
            <div
              onClick={() => {
                supabase.auth.signOut();
                localStorage.clear();
                navigate("/signin");
              }}
              className={styles.Logout}
            >
              Logout
            </div>
          )}
          {!id && (
            <button
              onClick={() => navigate("/profile-create?edit=true")}
              className={styles.editbutton}
            >
              <CiEdit />
            </button>
          )}
        </div>
      )}

      <Nabvar />
    </>
  );
};

export default Profile;
