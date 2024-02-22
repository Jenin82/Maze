import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

const Idea = () => {
	const { id } = useParams();
	const [data, setData] = useState<Idea>();
	const [user, setUser] = useState("");

	const fetchData = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			setUser(user.id);
			let { data: idea, error: ideaError } = await supabase
				.from("idea")
				.select("*, users(name)")
				.eq("id", id)
				.single();
			if (ideaError) {
				toast.error(ideaError.message);
				throw ideaError.message;
			} else if (idea) {
				setData(idea as unknown as Idea);
			}
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const req: string[] = JSON.parse(data?.requirements || "[]");

	return (
		<>
			{data && (
				<div>
					<h1>{data.title}</h1>
					<div>{data.users.name}</div>
					<div>
						Description:
						<br />
						{data.description}
					</div>
					<div>
						<h2>Requirements</h2>
						<ul>
							{req.map((requirement, index) => (
								<li key={index}>{requirement}</li>
							))}
						</ul>
					</div>
					{data.owner_id === user ? (
						<div>
							<button>request accept decline</button>
						</div>
					) : (
						<div>
							<button>Contribute</button>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default Idea;
