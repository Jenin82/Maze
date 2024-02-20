import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";

const Profile = () => {
	const [pic, setPic] = useState("");

	const fetchData = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			const { data } = supabase.storage
				.from("avatar")
				.getPublicUrl("avatar_" + user.id + ".jpeg");
			setPic(data.publicUrl);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>profile</div>
			<img src={pic} alt="test" />
			<div></div>
		</div>
	);
};

export default Profile;
