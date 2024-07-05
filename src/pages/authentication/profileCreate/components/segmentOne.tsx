import { FC } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "../index.module.css";
import { BackArrowsvg } from "../../../../assets/svg";

interface SegmentOneProps {
  role: string;
  setRole: (role: string) => void;
  setPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}

const roleOptions = [
  { value: "1e16dbb5-f885-4a0e-8593-8ecbcaf5eb3f", label: "Ideator" },
  { value: "bfd4a762-c807-4595-ba53-f7afcf1dc49c", label: "Developer" },
  { value: "4cd125f5-be3c-41c3-a321-4199dacefc1a", label: "Designer" },
];

const SegmentOne: FC<SegmentOneProps> = ({ role, setRole, setPage }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => {
          setPage(0);
          navigate(-1);
        }}
        className={styles.back}
      >
        <BackArrowsvg />
      </button>
      <div className={styles.SegmentOne}>
        <div>
          <h1>What are you?</h1>
          <p>Select what describes you the best.</p>
        </div>
        <Select
          options={roleOptions}
          onChange={(selectedOption) =>
            setRole(selectedOption ? selectedOption.value : "")
          }
          value={roleOptions.find((option) => option.value === role)}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: "#E9E9E9",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#E9E9E9",
              },
              width: "75vw",
              borderRadius: "25px",
              height: "40px",
            }),
          }}
        />
        <button
          onClick={() => {
            if (!role) {
              toast.error("Please select a role");
              return;
            } else {
              setPage(1);
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

export default SegmentOne;
