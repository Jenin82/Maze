import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

import styles from "../Registeration.module.css";
import { BackArrowsvg } from "../../../assets/svg";

const SignUp = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSignUp = async () => {
    let { data: res, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      throw error.message;
    } else {
      localStorage.setItem("user", JSON.stringify(res.session));
      return res;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(data).some(
      (value) => value.trim() === ""
    );
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (isAnyFieldEmpty) {
      toast.error("Please fill out all fields.");
      return;
    }

    toast.promise(handleSignUp(), {
      loading: "Signing up...",
      success: () => {
        navigate("/profile-create");
        return <b>Signed in successfully</b>;
      },
      error: (error) => {
        return <b>{error}</b>;
      },
    });
  };

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <button>
          <BackArrowsvg />
        </button>
        <div>
          <h1>Sign Up</h1>
          <p>Please sign up to get started</p>
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <p>Email</p>
          <input
            type="email"
            placeholder="email address"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div>
          <p>Password</p>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <div>
          <p>Re-Type Password</p>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) =>
              setData({
                ...data,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <span>
        I have an account? &nbsp;
        <a href="/signin">Sign in</a>
      </span>
      {/* <p>OR</p>
      <button className={styles.Google}>
        <Googlesvg /> <p>Sign up with Google</p>
      </button> */}
    </div>
  );
};

export default SignUp;
