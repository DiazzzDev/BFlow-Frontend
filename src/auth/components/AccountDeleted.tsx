import { useState } from "react";
import { UserRoundX } from "lucide-react";

import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/authStore";
import { queryClient } from "@/queryClient";

export const AccountDeleted = () => {
    const clearSession = useAuthStore((state) => state.clearSession);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const leaveDeletedAccount = async (destination: string) => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await authService.logout();
        } catch {
            // The local session must still be cleared if provider logout fails.
        } finally {
            queryClient.clear();
            clearSession();
            window.location.assign(destination);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-surface-hard px-6 py-12 text-light">
            <section className="w-full max-w-lg rounded-2xl border border-light-10 bg-surface p-8 text-center shadow-custom sm:p-10">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-sweet text-danger">
                    <UserRoundX className="h-7 w-7" aria-hidden="true" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight">Tu cuenta fue eliminada</h1>
                <p className="mt-3 text-sm leading-6 text-helper">
                    Tu cuenta de BFlow ya no está disponible y no puedes acceder a los datos asociados a ella.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        disabled={isLoggingOut}
                        onClick={() => {
                            void leaveDeletedAccount("/auth/register");
                        }}
                        className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-light transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Crear una nueva cuenta
                    </button>
                    <button
                        type="button"
                        disabled={isLoggingOut}
                        onClick={() => {
                            void leaveDeletedAccount("/auth/login");
                        }}
                        className="cursor-pointer rounded-lg border border-light-10 px-5 py-2.5 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                    </button>
                </div>
            </section>
        </main>
    );
};
