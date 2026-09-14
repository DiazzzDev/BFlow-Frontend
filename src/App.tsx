import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";

import { appRouter } from "./AppRouter.tsx";
import { AuthProvider } from "./auth/provider/AuthProvider.tsx";

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={appRouter} />
            <Toaster />
        </AuthProvider>
    );
}

export default App;
