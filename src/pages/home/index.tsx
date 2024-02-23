import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Clicksvg } from "../../assets/svg";
import { Nabvar } from "../../components/navbar";
import { Topnav } from "../../components/navbar/topnav";
import styles from "./index.module.css";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import { Searchsvg } from "../../components/navbar/svg";

const Home = () => {
	const [refresh, setRefresh] = useState(false);
	const [data, setData] = useState<ProfileData[]>([]);
	const [user, setUser] = useState("");
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const fetchData = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			setUser(user.id);
		}
		let { data: users, error } = await supabase
			.from("users")
			.select(
				`*, user_role_link(*,roles(*)), user_user_link!public_user_user_link_user_id_fkey(*)`
			); // Adjusted to use the specific relationship
		if (error) {
			toast.error(error.message);
			throw error.message;
		} else if (users) {
			setData(users);
		}
	};

	useEffect(() => {
		fetchData();
	}, [refresh]);

	const handleUpvote = async (userData: ProfileData) => {
		let { data: userUserLink, error } = await supabase
			.from("user_user_link")
			.select("*")
			.eq("user_id", userData.id)
			.eq("voter_id", user)
		if (error) {
			toast.error(error.message);
			throw new Error(error.message);
		} else if (userUserLink && userUserLink.length > 0) {
			// If the row already exists, update the voted field
			const { data, error } = await supabase
				.from("user_user_link")
				.update({ voted: true })
				.eq("id", userUserLink[0].id)
				.select();
			if (error) {
				throw new Error(error.message);
			} else if (data) {
				setRefresh(!refresh);
				return data;
			}
		} else {
			// If the row doesn't exist, insert a new row
			const { data, error } = await supabase
				.from("user_user_link")
				.upsert({ user_id: userData.id, voter_id: user, voted: true })
				.select();
			if (error) {
				throw new Error(error.message);
			} else if (data) {
				setRefresh(!refresh);
				return data;
			}
		}
	};

	const handleDownvote = async (userData: ProfileData) => {
		let { data: userUserLink, error } = await supabase
			.from("user_user_link")
			.select("*")
			.eq("user_id", userData.id)
			.eq("voter_id", user)
		if (error) {
			toast.error(error.message);
			throw new Error(error.message);
		} else if (userUserLink) {
			// If the row already exists, update the voted field
			const { data, error } = await supabase
				.from("user_user_link")
				.update({ voted: false })
				.eq("id", userUserLink[0].id)
				.select();
			if (error) {
				throw new Error(error.message);
			} else if (data) {
				setRefresh(!refresh);
				return data;
			}
		} else {
			// If the row doesn't exist, insert a new row
			const { data, error } = await supabase
				.from("user_user_link")
				.upsert({ user_id: userData.id, voter_id: user, voted: false })
				.select();
			if (error) {
				throw new Error(error.message);
			} else if (data) {
				setRefresh(!refresh);
				return data;
			}
		}
	};

	return (
		<div className={styles.Wrapper}>
			<Topnav />
			<div className={styles.participants}>
				<div>
					<h1 className={styles.infifty}>
						IN<span className="colorText">50</span>HRS
					</h1>
					<h2>Participants</h2>
				</div>
				<div className={styles.SearchField}><Searchsvg /><input type="text" placeholder="Search participant" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
				<div className={styles.InnerWrapper}>
					{data
						.filter(user => {
							return (user.name.toLowerCase().startsWith(search.toLowerCase()))
						})
						.map((user) => {
							const upvotes = user.user_user_link.filter(
								(link: { voted: boolean; }) => link.voted === true
							).length;
							const downvotes = user.user_user_link.filter(
								(link: { voted: boolean; }) => link.voted === false
							).length;
							const netVotes = upvotes - downvotes;
							return { ...user, netVotes }; // Adding netVotes to each user object
						})
						.sort((a, b) => b.netVotes - a.netVotes) // Sorting users based on netVotes in descending order
						.map((user, index) => (
							<div className={styles.Individual} key={index}>
								<img
									src={
										"https://mlwspjsnmivgrddhviyc.supabase.co/storage/v1/object/public/avatar/avatar_" +
										user.id +
										".jpeg"
									}
									alt={user.name}
								/>
								<div className={styles.headerset}>
									<h2>{user.name}</h2>
									<h3>{user.user_role_link.roles.name}</h3>
									<button onClick={() => navigate(`/profile/${user.id}`)}>
										See More <Clicksvg />
									</button>
								</div>
								<div className={styles.upward}>
									<div
										className={styles.up}
										onClick={() => handleUpvote(user)}
									>
										<p>
											{
												user.user_user_link.filter(
													(link: {
														voted: boolean;
													}) => link.voted === true
												).length
											}
										</p>
										<IoIosArrowUp />
									</div>
									<div
										className={styles.down}
										onClick={() => handleDownvote(user)}
									>
										<p>
											{
												user.user_user_link.filter(
													(link: {
														voted: boolean;
													}) => link.voted === false
												).length
											}
										</p>
										<IoIosArrowDown />
									</div>
								</div>
							</div>
						)) || <p>No participants found</p>}
				</div>
			</div>
			<Nabvar />
		</div>
	);
};

export default Home;
