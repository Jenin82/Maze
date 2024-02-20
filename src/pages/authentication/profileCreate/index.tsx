import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

const ProfileCreate = () => {
	const [data, setData] = useState<ProfileCreate>({
		id: "",
		name: "",
		email: "",
		bio: "",
		skills: [],
	});
	const navigate = useNavigate();
	const [newSkill, setNewSkill] = useState("");

	const handleCreateUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			const { data:response, error } = await supabase
				.from("users")
				.upsert({ ...data, id: user.id, email: user.email! })
				.select();
			if (error) {
				throw error.message;
			} else if (response) {
				return response;
			}
		} else {
			navigate("/signin");
			throw "User not found please sign in";
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const isAnyFieldEmpty = Object.entries(data)
			.filter(([key]) => key !== "id" && key !== "email" && key !== "skills")
			.some(([, value]) => value.trim() === "");

		if (isAnyFieldEmpty) {
			toast.error("Please fill out all fields.");
			return;
		}

		toast.promise(handleCreateUser(), {
			loading: "Creating your profile...",
			success: () => {
				navigate("/");
				return <b>Profile creation successful</b>;
			},
			error: (error) => {
				return <b>{error}</b>;
			},
		});
	};

	const handleAddSkill = () => {
		setData({
			...data,
			skills: [...data.skills, newSkill], // Add the new skill to the skills array
		});
		setNewSkill("");
	};

	const handleRemoveSkill = (index: number) => {
		const updatedSkills = [...data.skills];
		updatedSkills.splice(index, 1);
		setData({ ...data, skills: updatedSkills });
	};

	return (
		<div>
			<div>
				<b>Welcome Back</b>
				<span>
					Don&apos;t have an account yet? &nbsp;
					<a href="/signup">Sign up</a>
				</span>
				<form onSubmit={(e) => handleSubmit(e)}>
					<input
						type="text"
						placeholder="John Doe"
						onChange={(e) =>
							setData({ ...data, name: e.target.value })
						}
					/>
					<textarea
						placeholder="Bio"
						onChange={(e) =>
							setData({ ...data, bio: e.target.value })
						}
					/>
					<input
						type="text"
						placeholder="Enter skills"
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
					/>
					<button type="button" onClick={handleAddSkill}>
						Add Skill
					</button>
					<ul>
						{data.skills.map((skill, index) => (
							<li
								key={index}
								onClick={() => handleRemoveSkill(index)}
							>
								{skill}
							</li>
						))}
					</ul>
					<button type="submit">Create Profile</button>
				</form>
			</div>
		</div>
	);
};

export default ProfileCreate;
