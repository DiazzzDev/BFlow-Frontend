import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";

import { appRouter } from "./AppRouter.tsx";
import { AuthProvider } from "./auth/provider/AuthProvider.tsx";
import { AccountDeleted } from "./auth/components/AccountDeleted.tsx";
import { useAuthStore } from "./auth/authStore";

function App() {
    const authStatus = useAuthStore((state) => state.authStatus);

    return (
        <AuthProvider>
            {authStatus === "account-deleted" ? (
                <AccountDeleted />
            ) : (
                <RouterProvider router={appRouter} />
            )}
            <Toaster />
        </AuthProvider>
    );
}

export default App;
