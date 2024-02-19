import { useState } from "react";
import styles from "../index.module.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../utils/supabase";

const SignIn = () => {
	const [data, setData] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();

	const handleSignUp = async () => {
		let { data: res, error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password
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
		<div className={styles.signInWrapper}>
			<div className={styles.signInCard}>
				<b>Welcome Back</b>
				<span>
					Don&apos;t have an account yet? &nbsp;
					<a href="/signup">Sign up</a>
				</span>
				<form onSubmit={(e) => handleSubmit(e)}>
					<input
						type="email"
						placeholder="email address"
						onChange={(e) =>
							setData({ ...data, email: e.target.value })
						}
					/>
					<input
						type="password"
						placeholder="••••••••"
						onChange={(e) =>
							setData({ ...data, password: e.target.value })
						}
					/>
					<button type="submit">Sign In</button>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
