import { RouterProvider } from "react-router";
import { appRouter } from "./AppRouter.jsx";

function App() {
	return (
		<>
		<RouterProvider router={appRouter} />
		</>
	)
}

export default App
