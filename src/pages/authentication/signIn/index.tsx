import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

import styles from "../Registeration.module.css";
import { BackArrowsvg, Googlesvg } from "../../../assets/svg";

const SignIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignIn = async () => {
    let { data: res, error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      throw error.message;
    } else {
      localStorage.setItem("user", JSON.stringify(res.session));
      const { data, error } = await supabase.rpc("get_user_roles", {
        check_user_id: res.user?.id,
      });
      if (error) {
        throw error.message;
      } else {
        const roles = data.map((role: { role_name: string }) => role.role_name);
        localStorage.setItem("roles", JSON.stringify(roles));
        return data;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(data).some(
      (value) => value.trim() === ""
    );
    if (isAnyFieldEmpty) {
      toast.error("Please fill out all fields.");
      return;
    }

    toast.promise(handleSignIn(), {
      loading: "Signing in...",
      success: () => {
        navigate("/");
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
          <h1>Log In</h1>
          <p>Please sign in to your existing account</p>
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
        <div className={styles.ForgotPass}>
          <div>
            {" "}
            <input id="remeberme" type="checkbox" />
            <label htmlFor="remeberme">Remember me </label>
          </div>
          <button>Forgot Password</button>
        </div>
        <button type="submit">Sign In</button>
      </form>

      <span>
        Don&apos;t have an account? &nbsp;
        <a href="/signup">Sign up</a>
      </span>
      <p>OR</p>
      <button className={styles.Google}>
        <Googlesvg /> <p>Sign in with Google</p>
      </button>
    </div>
  );
};

export default SignIn;
