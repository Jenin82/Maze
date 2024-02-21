import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import toast from "react-hot-toast";

export const PrivateRoute = () => {
	const navigate = useNavigate();

	function isEventStarted(): boolean {
		const eventStartDate = new Date("2024-02-23T10:00:00.000Z");

		const now = new Date().getTime();
		const millisecondsSinceStart = now - eventStartDate.getTime();
		return millisecondsSinceStart >= 0;
	}

	async function handleClick() {
		const roles = localStorage.getItem("roles");
		const session = await supabase.auth.getSession();
		if (!session.data.session?.access_token) {
			await supabase.auth.signOut();
			toast.error("Please sign in first");
			navigate("/signin");
		} else if (!roles || roles.length === 0) {
			toast.error("Please update your profile");
			navigate("/profile-create");
		} else if (!isEventStarted()) {
			navigate("/welcome");
		}
	}

	useEffect(() => {
		handleClick();
	}, [navigate]);

	return <Outlet />;
};
