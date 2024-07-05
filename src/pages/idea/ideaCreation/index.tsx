import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../utils/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { Roles } from "../../../services/Roles";
import styles from "./index.module.css";
import { Topnav } from "../../../components/navbar/topnav";
import { Nabvar } from "../../../components/navbar";

const IdeaCreation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL
  const [data, setData] = useState<IdeaCreate>({
    owner_id: "",
    title: "",
    description: "",
    requirements: [],
  });
  const [newRequirement, setNewRequirement] = useState("");

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: roles, error: roleError } = await supabase.rpc(
        "get_user_roles",
        {
          check_user_id: user.id,
        }
      );
      if (roleError) {
        toast.error(roleError.message);
        throw roleError.message;
      } else if (roles) {
        if (roles[0].role_name !== Roles.IDEATOR) {
          navigate("/");
          toast.error("You are not an ideator");
          throw "You are not an ideator";
        } else {
          if (id) {
            let { data: idea, error: ideaError } = await supabase
              .from("idea")
              .select("*")
              .eq("id", id)
              .single();

            if (ideaError) {
              toast.error(ideaError.message);
              throw ideaError.message;
            } else if (idea) {
              setData({
                owner_id: idea.owner_id,
                title: idea.title,
                description: idea.description,
                requirements: Array.isArray(idea.requirements)
                  ? idea.requirements
                  : JSON.parse(idea.requirements || "[]"),
              });
            }
          } else {
            let { data: idea, error: ideaError } = await supabase
              .from("idea")
              .select("*")
              .eq("owner_id", user.id);

            if (ideaError) {
              toast.error(ideaError.message);
              throw ideaError.message;
            } else if (idea && idea.length > 0) {
              navigate("/idea-list");
              toast.error("You already have an idea");
              throw "You already have an idea";
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIdeaCreate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const ideaData = {
        ...data,
        owner_id: user.id,
      };
      if (id) {
        ideaData.id = id;
      }

      const { data: response, error: responseError } = await supabase
        .from("idea")
        .upsert([ideaData])
        .select();
      if (responseError) {
        toast.error(responseError.message);
        throw responseError.message;
      } else if (response) {
        return response;
      }
    }
  };

  const handleSubmit = async () => {
    const isAnyFieldEmpty = Object.entries(data)
      .filter(([key]) => key !== "requirements" && key !== "owner_id")
      .some(([, value]) => value.trim() === "");

    if (isAnyFieldEmpty) {
      toast.error("Please fill out all fields.");
      return;
    }

    toast.promise(handleIdeaCreate(), {
      loading: "Creating your idea...",
      success: () => {
        navigate("/idea-list");
        return <b>Idea created</b>;
      },
      error: (error) => {
        return <b>{error}</b>;
      },
    });
  };

  const handleAddRequirement = () => {
    setData({
      ...data,
      requirements: [...data.requirements, newRequirement],
    });
    setNewRequirement("");
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...data.requirements];
    updatedRequirements.splice(index, 1);
    setData({ ...data, requirements: updatedRequirements });
  };

  return (
    <>
      <Topnav />
      <div className={styles.Wrapper}>
        <h1>
          Idea <span className="colorText">{id ? "Edit" : "Creation"}</span>
        </h1>

        <div className={styles.FormContainer}>
          <div>
            <p>Title</p>
            <input
              type="text"
              placeholder="Title"
              value={data.title}
              onChange={(e) =>
                setData({
                  ...data,
                  title: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <p>Description</p>
            <textarea
              placeholder="Description"
              value={data.description}
              onChange={(e) =>
                setData({
                  ...data,
                  description: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <p>Requirements (optional)</p>
            <div>
              <input
                type="text"
                placeholder="Enter requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className={styles.Addbutton}
              >
                +
              </button>
            </div>
            <div className={styles.requirement}>
              {Array.isArray(data.requirements) &&
                data.requirements.map((requirement, index) => (
                  <p key={index}  onClick={() => handleRemoveRequirement(index)}>
                    {requirement}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <button onClick={handleSubmit} className={styles.NextButton}>
          Continue
        </button>
      </div>
      <Nabvar />
    </>
  );
};

export default IdeaCreation;
