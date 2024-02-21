import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const [pic, setPic] = useState("");
	const [data, setData] = useState<ProfileCreate>({
		id: "",
		name: "",
		email: "",
		bio: "",
		skills: [],
		projects: [],
		linkedin: "",
		github: "",
		x: "",
		muid: "",
	});
	const navigate = useNavigate();

	const fetchData = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			const { data } = supabase.storage
				.from("avatar")
				.getPublicUrl(`avatar_${user.id}.jpeg?timestamp=${Date.now()}`);
			if (data.publicUrl) {
				setPic(data.publicUrl);
				let { data: users, error } = await supabase
					.from("users")
					.select("*")
					.eq("id", user.id);
				if (error) {
					toast.error(error.message);
					throw error.message;
				} else if (users) {
					setData(users[0]);
					return users[0];
				}
			}
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			{pic && data && (
				<div>
					<div>profile</div>
					<img src={pic} alt="test" />
					<div>{data.name}</div>
					<div>{data.email}</div>
					<div>{data.bio}</div>
					<div>
						{data.skills.map((skill, index) => (
							<div key={index}>{skill}</div>
						))}
					</div>
					<div
						onClick={() => {
							supabase.auth.signOut();
							localStorage.clear();
							navigate("/signin");
						}}
					>
						Logout
					</div>
				</div>
			)}
		</>
	);
};

export default Profile;
