import { FC } from "react";
import styles from "../index.module.css";
import { BackArrowsvg } from "../../../../assets/svg";

interface OptionalFieldsProps {
  data: ProfileCreate;
  setData: (data: ProfileCreate) => void;
  handleSubmit: () => void;
  setPage: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
}

const OptionalFields: FC<OptionalFieldsProps> = ({
  data,
  setData,
  handleSubmit,
  setPage,
}) => (
  <div className={styles.optionalFieldswra}>
    <button onClick={() => setPage(1)} className={styles.back}>
      <BackArrowsvg />
    </button>
    <div className={styles.OptionalFields}>
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
      <div className={styles.List}>
        {data.projects.map((project, index) => (
          <a href={project.link} key={index} target="_blank" rel="noreferrer">
            <p
              onClick={() => {
                const updatedProjects = [...data.projects];
                updatedProjects.splice(index, 1);
                setData({ ...data, projects: updatedProjects });
              }}
            >
              {project.name}
            </p>
          </a>
        ))}
      </div>
      <button onClick={handleSubmit} className={styles.NextButton}>
        Continue
      </button>
    </div>
  </div>
);

export default OptionalFields;
