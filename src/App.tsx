import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/notFound";
import Home from "./pages/home";
import SignUp from "./pages/authentication/pages/signUp";

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
		// {
		// 	path: "/",
		// 	element: <PrivateRoute />,
		// 	children: [
		// 		{
		// 			path: "/profile",
		// 			element: <Profile />,
		// 		},
		// 		{
		// 			path: "/",
		// 			element: <RoleChecker allowedRoles={[Roles.ADMIN]} />,
		// 			children: [
		// 				{
		// 					path: "/payment-status",
		// 					element: <Admin />,
		// 				},
		// 				{
		// 					path: "/payment-status/:id",
		// 					element: <PaymentStatus />,
		// 				},
		// 			],
		// 		},
		// 	],
		// },
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
