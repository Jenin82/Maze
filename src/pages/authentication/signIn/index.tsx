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
          {/* <div>
            {" "}
            <input id="remeberme" type="checkbox" />
            <label htmlFor="remeberme">Remember me </label>
          </div>
          <button>Forgot Password</button> */}
        </div>
        <button type="submit">Sign In</button>
      </form>

      <span>
        Don&apos;t have an account? &nbsp;
        <a href="/signup">Sign up</a>
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
            text="continue_with"
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

export default SignIn;
