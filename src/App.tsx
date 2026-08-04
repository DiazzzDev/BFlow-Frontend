import { RouterProvider } from "react-router/dom";

import { appRouter } from "./AppRouter.tsx";
import { AuthProvider } from "./auth/provider/AuthProvider.tsx";

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={appRouter} />
        </AuthProvider>
    );
}

export default App;
