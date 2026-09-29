import { useEffect, useState } from "react";

import { registerFirebaseDevice, unregisterFirebaseDevice } from "../firebase.service";

import { useAuthStore } from "@/auth/authStore";

const getNotificationsPreferenceKey = (userId: string) =>
    `bflow-notifications-disabled:${userId}`;

const hasDisabledNotifications = (userId: string) => {
    try {
        return window.localStorage.getItem(getNotificationsPreferenceKey(userId)) === "true";
    } catch {
        return false;
    }
};

const setNotificationsDisabled = (userId: string, disabled: boolean) => {
    try {
        const key = getNotificationsPreferenceKey(userId);
        if (disabled) {
            window.localStorage.setItem(key, "true");
        } else {
            window.localStorage.removeItem(key);
        }
    } catch {
        // Storage can be unavailable in private browsing or embedded contexts.
    }
};

/** Registers the authenticated browser once push configuration is available. */
export const useRegisterFcmDevice = () => {
    const userId = useAuthStore((state) => state.user?.id);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!userId) {
            setIsEnabled(false);
            return;
        }

        const browserPermissionGranted =
            typeof Notification !== "undefined" && Notification.permission === "granted";
        const shouldRegister = browserPermissionGranted && !hasDisabledNotifications(userId);

        setIsEnabled(shouldRegister);
        if (!shouldRegister) {
            return;
        }

        void registerFirebaseDevice({ requestPermission: false }).catch((error: unknown) => {
            console.warn("[FCM] No se pudo registrar el dispositivo", error);
        });
    }, [userId]);

    const enableNotifications = async () => {
        if (!userId) {
            return false;
        }

        setIsUpdating(true);
        try {
            const enabled = await registerFirebaseDevice({ requestPermission: true });
            if (enabled) {
                setNotificationsDisabled(userId, false);
                setIsEnabled(true);
            }
            return enabled;
        } finally {
            setIsUpdating(false);
        }
    };

    const disableNotifications = async () => {
        if (!userId) {
            return false;
        }

        setIsUpdating(true);
        try {
            await unregisterFirebaseDevice();
            setNotificationsDisabled(userId, true);
            setIsEnabled(false);
            return true;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        disableNotifications,
        enableNotifications,
        isEnabled,
        isUpdating,
    };
};
