import { useEffect } from "react";

import { registerFirebaseDevice } from "../firebase.service";

import { useAuthStore } from "@/auth/authStore";

/** Registers the authenticated browser once push configuration is available. */
export const useRegisterFcmDevice = () => {
    const userId = useAuthStore((state) => state.user?.id);

    useEffect(() => {
        if (!userId) {
            return;
        }

        void registerFirebaseDevice().catch((error: unknown) => {
            console.warn("[FCM] No se pudo registrar el dispositivo", error);
        });
    }, [userId]);
};
