import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RoleCheckerFunction } from "../../../services/RoleChecker";
import { Roles } from "../../../services/Roles";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router-dom";

const IdeaList = () => {
	const [data, setData] = useState<Idea[]>([]);
	const [user, setUser] = useState("");
	const navigate = useNavigate();

	const fetchData = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			setUser(user.id);
			let { data: idea, error: ideaError } = await supabase
				.from("idea")
				.select("*");
			if (ideaError) {
				toast.error(ideaError.message);
				throw ideaError.message;
			} else if (idea) {
				setData(idea);
			}
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<div>
			<h1>Idea</h1>
			<RoleCheckerFunction roles={[Roles.IDEATOR]}>
				<div>
					<button>Create new idea</button>
				</div>
			</RoleCheckerFunction>
			<div>
				<h2>My idea</h2>
				{data.map((idea) => (
					<>
						{idea.owner_id === user && (
							<div key={idea.id} onClick={() => {navigate(`/idea/${idea.id}`)}}>
								<h3>{idea.title}</h3>
								<p>{idea.description}</p>
							</div>
						)}
					</>
				))}
			</div>
			<div>
				<h2>Other ideas</h2>
				{data.map((idea) => (
					<>
						{idea.owner_id !== user && (
							<div key={idea.id} onClick={() => {navigate(`/idea/${idea.id}`)}}>
								<h3>{idea.title}</h3>
								<p>{idea.description}</p>
							</div>
						)}
					</>
				))}
			</div>
		</div>
	);
};

export default IdeaList;
