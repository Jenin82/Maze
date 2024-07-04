import { ChangeEvent, FC, useEffect, useState } from "react";
import styles from "../index.module.css";
import { BackArrowsvg } from "../../../../assets/svg";
import toast from "react-hot-toast";
import { convertToWebP } from "../../../../utils/imageUtils";
import { supabase } from "../../../../utils/supabase";

interface SegmentTwoProps {
  data: ProfileCreate;
  setData: (data: ProfileCreate) => void;
  setNewSkill: (newSkill: string) => void;
  newSkill: string;
  handleAddSkill: () => void;
  handleRemoveSkill: (index: number) => void;
  profilePic: File | null;
  setProfilePic: (file: File | null) => void;
  setPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}

const SegmentTwo: FC<SegmentTwoProps> = ({
  data,
  setData,
  setNewSkill,
  newSkill,
  handleAddSkill,
  handleRemoveSkill,
  setProfilePic,
  setPage,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleProfilePicChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const convertedFile = await convertToWebP(file);
      setProfilePic(
        new File([convertedFile], "profile.webp", { type: "image/webp" })
      );

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(convertedFile);
    } else {
      setProfilePic(null);
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    fetchProfilePic();
  }, []);

  const fetchProfilePic = async () => {
    const user = await supabase.auth.getSession();
    const { data } = supabase.storage
      .from("avatar")
      .getPublicUrl(`avatar_${user.data.session?.user.id}.webp?timestamp=${Date.now()}`);
    if (data.publicUrl) {
      setPreviewImage(data.publicUrl);
    }
  };

  return (
    <>
      <button onClick={() => setPage(0)}>
        <BackArrowsvg />
      </button>
      <div className={styles.SegmentTwo}>
        <div>
          <h1>Let’s know you</h1>
          <p>Complete your profile.</p>
        </div>
        <div className={styles.InnerWrap}>
          <div>
            <p>Name</p>
            <input
              type="text"
              placeholder="John Doe"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>
          <div>
            <p>Upload Profile</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              required
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                width={100}
                height={100}
                className={styles.PreviewImage}
              />
            )}
          </div>
          <div>
            <p>Bio</p>
            <textarea
              placeholder="Bio"
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              required
              value={data.bio}
            />
          </div>
          <div>
            <p>Skills</p>
            <div className={styles.SkillInput}>
              <input
                type="text"
                placeholder="Enter skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button type="button" onClick={handleAddSkill}>
                +
              </button>
            </div>
          </div>
        </div>
        <div className={styles.List}>
          {data.skills.map((skill, index) => (
            <p key={index} onClick={() => handleRemoveSkill(index)}>
              {skill}
            </p>
          ))}
        </div>
        <button
          onClick={() => {
            if (!data.name || !data.bio || !data.skills.length) {
              toast.error("Please fill out all fields");
              return;
            } else {
              setPage(2);
            }
          }}
          className={styles.NextButton}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default SegmentTwo;
