import { useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../../services/Roles";

const IdeaCreation = () => {
	const navigate = useNavigate();

	const fetchData = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			const { data: roles, error: roleError } = await supabase.rpc(
				"get_user_roles",
				{
					check_user_id: user.id,
				}
			);
			if (roleError) {
				toast.error(roleError.message);
				throw roleError.message;
			} else if (roles) {
				if (roles[0].role_name !== Roles.IDEATOR) {
					navigate("/");
					toast.error("You are not an ideator");
					throw "You are not an ideator";
				}
			}
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return <div>IdeaCreation</div>;
};

export default IdeaCreation;
