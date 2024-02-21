import { ChangeEvent, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

import styles from "./profilecreate.module.css";

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
  const [newProject, setNewProject] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

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

    if (!profilePic) {
      toast.error("Please upload a profile picture.");
      return;
    }

    toast.promise(handleCreateUser(), {
      loading: "Creating your profile...",
      success: () => {
        navigate("/");
        return <b>Profile update successful</b>;
      },
      error: (error) => {
        return <b>{error}</b>;
      },
    });
  };

  const handleAddSkill = () => {
    setData({
      ...data,
      skills: [...data.skills, newSkill], // Add the new skill to the skills array
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...data.skills];
    updatedSkills.splice(index, 1);
    setData({ ...data, skills: updatedSkills });
  };

  const handleAddProject = () => {
    setData({
      ...data,
      projects: [...data.projects, newProject],
    });
    setNewProject("");
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = [...data.projects];
    updatedProjects.splice(index, 1);
    setData({ ...data, projects: updatedProjects });
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProfilePic(file || null);
  };

  const handleRoleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setRole(event.target.value);
  };
  return (
    <div className={styles.Wrapper}>
      {page === 0 ? (
        <div>
          <h1>What are you?</h1>
          <select onChange={handleRoleChange} value={role}>
            <option value="">Select a role</option>
            <option value="1e16dbb5-f885-4a0e-8593-8ecbcaf5eb3f">
              Ideator
            </option>
            <option value="bfd4a762-c807-4595-ba53-f7afcf1dc49c">
              Developer
            </option>
            <option value="4cd125f5-be3c-41c3-a321-4199dacefc1a">
              Designer
            </option>
          </select>
          <button
            onClick={() => {
              if (!role) {
                toast.error("Please select a role");
                return;
              } else {
                setPage(1);
              }
            }}
          >
            Next
          </button>
        </div>
      ) : page === 1 ? (
        <div>
          <input
            type="text"
            placeholder="John Doe"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            required
          />
          <textarea
            placeholder="Bio"
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Enter skills"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button type="button" onClick={handleAddSkill}>
            Add Skill
          </button>
          <ul>
            {data.skills.map((skill, index) => (
              <li key={index} onClick={() => handleRemoveSkill(index)}>
                {skill}
              </li>
            ))}
          </ul>
          <button onClick={() => setPage(0)}>Back</button>
          <button
            onClick={() => {
              if (!data.name || !data.bio || !data.skills.length) {
                toast.error("Please fill out all fields");
                return;
              } else {
                setPage(2);
              }
            }}
          >
            Next
          </button>
        </div>
      ) : (
        <div>
          <h2>Optional fields</h2>
          <input
            type="text"
            placeholder="LinkedIn URL"
            onChange={(e) => setData({ ...data, linkedin: e.target.value })}
          />
          <input
            type="text"
            placeholder="Github URL"
            onChange={(e) => setData({ ...data, github: e.target.value })}
          />
          <input
            type="text"
            placeholder="X URL"
            onChange={(e) => setData({ ...data, x: e.target.value })}
          />
          <input
            type="text"
            placeholder="MuLearn ID / MuId"
            onChange={(e) => setData({ ...data, muid: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Project URL"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <button type="button" onClick={handleAddProject}>
            Add Project
          </button>
          <ul>
            {data.projects.map((project, index) => (
              <li key={index} onClick={() => handleRemoveProject(index)}>
                {project}
              </li>
            ))}
          </ul>
          <button onClick={() => setPage(1)}>Back</button>
          <button onClick={handleSubmit}>Update Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfileCreate;
