import { RouterProvider } from "react-router";

import { appRouter } from "./AppRouter.tsx";

function App() {
	return (
		<RouterProvider router={appRouter} />
	)
}

export default App
