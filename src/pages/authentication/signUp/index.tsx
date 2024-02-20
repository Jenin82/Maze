import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

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
		<div>
			<div>
				<b>Get Started</b>
				<span>
					Already have an account? &nbsp;<a href="/signin">Sign in</a>
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
					<button type="submit">Sign Up</button>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
