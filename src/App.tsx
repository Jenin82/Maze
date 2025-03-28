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
import IdeaList from "./pages/idea/ideaList";
import Idea from "./pages/idea/idea";
import Privacy from "./pages/privacy";
import { LeaderboardProject } from "./pages/leaderboradProject";

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
      path: "/",
      element: <Welcome />,
    },
    {
      path: "/privacy",
      element: <Privacy />,
    },
    {
      path: "/profile-create",
      element: <ProfileCreate />,
    },
    {
      path: "/leaderboard",
      element: <LeaderboardProject />,
    },
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/idea-list",
          element: <IdeaList />,
        },
        {
          path: "/idea/:id",
          element: <Idea />,
        },
        {
          path: "/",
          element: <RoleChecker allowedRoles={[Roles.IDEATOR]} />,
          children: [
            {
              path: "/idea-create",
              element: <IdeaCreation />,
            },
            {
              path: "/idea-edit/:id",
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
