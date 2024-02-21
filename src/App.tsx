import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import SignUp from "./pages/authentication/signUp";
import SignIn from "./pages/authentication/signIn";
import ProfileCreate from "./pages/authentication/profileCreate";
import Profile from "./pages/authentication/profile";
import NotFound from "./pages/notFound/NotFound";
import IdeaCreation from "./pages/idea/ideaCreation";
import { PrivateRoute } from "./services/PrivateRoutes";
import { RoleChecker } from "./services/RoleChecker";
import { Roles } from "./services/Roles";
import Welcome from "./pages/welcome";

function App() {
	const router = createBrowserRouter([
		{
			path: "*",
			element: <NotFound />,
		},
		{
			path: "/404",
			element: <NotFound />,
		},
		{
			path: "/signup",
			element: <SignUp />,
		},
		{
			path: "/signin",
			element: <SignIn />,
		},
		{
			path: "/welcome",
			element: <Welcome/>,
		},
		{
			path: "/",
			element: <PrivateRoute />,
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/profile-create",
					element: <ProfileCreate />,
				},
				{
					path: "/profile",
					element: <Profile />,
				},
				{
					path: "/",
					element: <RoleChecker allowedRoles={[Roles.IDEATOR]} />,
					children: [
						{
							path: "/idea-create",
							element: <IdeaCreation />,
						},
					],
				},
			],
		},
	]);
	return (
		<div className="App">
			<RouterProvider router={router} />
			<Toaster
				position="bottom-center"
				reverseOrder={false}
				toastOptions={{
					success: {
						style: {
							background: "var(--border)",
							color: "var(--foreground)",
						},
					},
					error: {
						style: {
							background: "var(--border)",
							color: "var(--foreground)",
						},
					},
				}}
			/>
		</div>
	);
}

export default App;
