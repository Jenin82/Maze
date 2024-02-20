import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";

import Home from "./pages/home";
import SignUp from "./pages/authentication/signUp";
import SignIn from "./pages/authentication/signIn";
import ProfileCreate from "./pages/authentication/profileCreate";
import Profile from "./pages/authentication/profile";
import NotFound from "./pages/notFound/NotFound";

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
			path: "/",
			element: <Home />,
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
			path: "/profile-create",
			element: <ProfileCreate/>,
		},
		{
			path: "/profile",
			element: <Profile/>,
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
