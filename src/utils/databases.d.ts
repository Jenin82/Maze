interface ProfileCreate {
	id: string;
	name: string;
	email: string;
	bio: string;
	skills: string[];
	projects: Projects[];
	linkedin: string;
	github: string;
	x: string;
	muid: string;
}

interface Projects {
	name: string;
	link: string;
	description: string;
}

interface IdeaCreate {
	owner_id: string;
	title: string;
	description: string;
	requirements: string[];
}

interface Idea {
	id: string;
	owner_id: string;
	title: string;
	description: string;
	requirements: string;
	users: {
		name: string;
	};
}

interface IdeaUserLink {
	id: string;
	idea_id: string;
	user_id: string;
	status: string;
	voted: boolean | null;
	users: {
		name: string;
	};
}
