import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
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

  async function handleSignInWithGoogle(response: CredentialResponse) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.credential!,
    });
    if (error) {
      console.log(error);
    } else if (data) {
      let { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.user.email!)
        .single();
      if (userError) {
        if (userError.code === "PGRST116") {
          navigate("/profile-create");
        }
      } else if (user) {
        toast.success("Logged in successfully");
        localStorage.setItem("user", JSON.stringify(data.session));
        const { data: roles, error } = await supabase.rpc("get_user_roles", {
          check_user_id: user.id,
        });
        if (error) {
          throw error.message;
        } else {
          const role = [roles[0].role_name];
          localStorage.setItem("roles", JSON.stringify(role));
          navigate("/home");
          return data;
        }
      }
      return data;
    }
  }

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <button onClick={() => navigate("/")}>
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
      <p>or</p>
      <GoogleOAuthProvider clientId="680733323712-a4stn8aig85464d9iessk1o6oja948ah.apps.googleusercontent.com">
        <div
          style={{
            width: "100%",
            padding: 0,
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            zIndex: 9999,
          }}
        >
          <GoogleLogin
            width={300}
            size="large"
            shape="pill"
            theme={"outline"}
            text="signup_with"
            onSuccess={(credentialResponse) => {
              handleSignInWithGoogle(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            cancel_on_tap_outside
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignUp;
