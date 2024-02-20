import { ChangeEvent, useState } from "react";
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
	const [profilePic, setProfilePic] = useState<File | null>(null);

	const handleCreateUser = async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (user) {
			const { data: response, error } = await supabase
				.from("users")
				.upsert({ ...data, id: user.id, email: user.email! })
				.select();
			if (error) {
				throw error.message;
			} else if (response && profilePic) {
				await supabase.storage
					.from("avatar")
					.upload("avatar_" + user.id + ".jpeg", profilePic, {
						upsert: true,
					});
			}
		} else {
			navigate("/signin");
			throw "User not found please sign in";
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const isAnyFieldEmpty = Object.entries(data)
			.filter(
				([key]) => key !== "id" && key !== "email" && key !== "skills"
			)
			.some(([, value]) => value.trim() === "");

		if (isAnyFieldEmpty) {
			toast.error("Please fill out all fields.");
			return;
		}

		if (!profilePic) {
			toast.error("Please upload a profile picture.");
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

	const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setProfilePic(file || null);
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
						required
					/>
					<input
						type="file"
						accept="image/*"
						onChange={handleProfilePicChange}
						required // Make the input required
					/>
					<textarea
						placeholder="Bio"
						onChange={(e) =>
							setData({ ...data, bio: e.target.value })
						}
						required
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
