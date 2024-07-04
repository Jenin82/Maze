import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import styles from "./index.module.css";
import SegmentOne from "./components/segmentOne";
import SegmentTwo from "./components/segmentTwo";
import OptionalFields from "./components/optionalFields";

const ProfileCreate = () => {
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
  const [role, setRole] = useState<string>("");
  const [page, setPage] = useState<0 | 1 | 2>(0);
  const navigate = useNavigate();
  const [newSkill, setNewSkill] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (userError) {
          toast.error("Error fetching user data");
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from("user_role_link")
          .select("role_id")
          .eq("user_id", user.id)
          .single();
        if (roleError) {
          toast.error("Error fetching user role");
          return;
        }

        setData({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          bio: userData.bio,
          skills: userData.skills || [],
          projects: userData.projects || [],
          linkedin: userData.linkedin || "",
          github: userData.github || "",
          x: userData.x || "",
          muid: userData.muid || "",
        });
        setRole(roleData.role_id);
      } else {
        navigate("/signin");
        toast.error("User not found, please sign in");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCreateUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: response, error } = await supabase
        .from("users")
        .upsert({ ...data, id: user.id, email: user.email! })
        .select();
      if (error) {
        throw error.message;
      } else if (response && profilePic) {
        await supabase.storage
          .from("avatar")
          .upload("avatar_" + user.id + ".jpeg", profilePic, {
            upsert: true,
          });
        const { data: roleResponse, error: roleError } = await supabase
          .from("user_role_link")
          .upsert({ user_id: user.id, role_id: role })
          .select();
        if (roleError) {
          throw roleError.message;
        } else if (roleResponse) {
          return roleResponse;
        }
      }
    } else {
      navigate("/signin");
      throw "User not found please sign in";
    }
  };

  const handleSubmit = async () => {
    const isAnyFieldEmpty = Object.entries(data)
      .filter(
        ([key]) =>
          key !== "id" &&
          key !== "email" &&
          key !== "skills" &&
          key !== "projects" &&
          key !== "x" &&
          key !== "muid" &&
          key !== "github" &&
          key !== "linkedin"
      )
      .some(([, value]) => value.trim() === "");

    if (isAnyFieldEmpty) {
      toast.error("Please fill out all fields.");
      return;
    }

    toast.promise(handleCreateUser(), {
      loading: "Creating your profile...",
      success: () => {
        localStorage.setItem("roles", JSON.stringify([role]));
        navigate("/signin");
        return <b>Profile update successful</b>;
      },
      error: (error) => {
        return <b>{error}</b>;
      },
    });
  };

  return (
    <div className={styles.Wrapper}>
      {page === 0 && (
        <SegmentOne role={role} setRole={setRole} setPage={setPage} />
      )}
      {page === 1 && (
        <SegmentTwo
          data={data}
          setData={setData}
          setNewSkill={setNewSkill}
          newSkill={newSkill}
          handleAddSkill={() => {
            if (newSkill.trim() === "") {
              toast.error("Please enter a skill.");
              return;
            }
            setData({ ...data, skills: [...data.skills, newSkill] });
            setNewSkill("");
          }}
          handleRemoveSkill={(index: number) => {
            const updatedSkills = [...data.skills];
            updatedSkills.splice(index, 1);
            setData({ ...data, skills: updatedSkills });
          }}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          setPage={setPage}
        />
      )}
      {page === 2 && (
        <OptionalFields
          data={data}
          setData={setData}
          handleSubmit={handleSubmit}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default ProfileCreate;
