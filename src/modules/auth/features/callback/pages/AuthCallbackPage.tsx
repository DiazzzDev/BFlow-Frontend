import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/store/authStore";
import type { InternalUser } from "@/auth/types/InternalUser";

export const AuthCallbackPage = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        const syncUser = async () => {

            if (!auth.isLoading && auth.isAuthenticated && auth.user) {
                
                const accessToken = auth.user.access_token;
                const idToken = auth.user.id_token;

                try {
                    const res = await fetch("http://localhost:8080/api/v2/auth/sync", {
                            method:"POST",

                            headers:{
                            Authorization:`Bearer ${accessToken}`,
                            "Content-Type":"application/json"
                        },

                        body:JSON.stringify({
                            idToken,
                            email:auth.user.profile.email,
                            emailVerified:auth.user.profile.email_verified,
                        })
                    });

                    if (!res.ok) {
                        throw new Error("Failed to sync user");
                    }

                    const data = await res.json() as InternalUser;

                    useAuthStore.getState().setUser(data);

                    void navigate("/app/dashboard", {
                        replace:true
                    });
                } catch(err){
                    console.error(err);
                    void navigate("/auth/login?error=auth_sync_failed",{
                        replace:true
                    });
                }
            }
        };

        void syncUser();

    }, [
        auth.isAuthenticated,
        auth.isLoading,
        auth.user,
        navigate
    ]);
    return (
        <div className="w-full h-screen flex items-center justify-center">
            Iniciando sesión...
        </div>
    );
};