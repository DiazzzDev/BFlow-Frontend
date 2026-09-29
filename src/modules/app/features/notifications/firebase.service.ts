import type { Messaging } from "firebase/messaging";

import { registerDeviceToken, unregisterDeviceToken } from "./notifications.service";

import { config } from "@/config/config";

const firebaseConfig = {
    apiKey: String(config.FIREBASE_API_KEY),
    authDomain: String(config.FIREBASE_AUTH_DOMAIN),
    projectId: String(config.FIREBASE_PROJECT_ID),
    storageBucket: String(config.FIREBASE_STORAGE_BUCKET),
    messagingSenderId: String(config.FIREBASE_MESSAGING_SENDER_ID),
    appId: String(config.FIREBASE_APP_ID),
};

const hasRequiredConfig = Object.values(firebaseConfig).every(Boolean);
let registrationInFlight: Promise<boolean> | null = null;
let foregroundListenerRegistered = false;

const getMessagingClient = async (): Promise<Messaging | null> => {
    if (
        !config.FIREBASE_ENABLED ||
        !hasRequiredConfig ||
        !config.FIREBASE_VAPID_KEY ||
        !("serviceWorker" in navigator)
    ) {
        return null;
    }

    const [{ getApp, getApps, initializeApp }, messagingModule] =
        await Promise.all([import("firebase/app"), import("firebase/messaging")]);

    if (!(await messagingModule.isSupported())) {
        return null;
    }

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return messagingModule.getMessaging(app);
};

const getServiceWorkerUrl = (): string => {
    const url = new URL("/firebase-messaging-sw.js", window.location.origin);

    Object.entries(firebaseConfig).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    return url.toString();
};

type RegisterFirebaseDeviceOptions = {
    requestPermission?: boolean;
};

const getFirebaseToken = async (messaging: Messaging): Promise<string | null> => {
    await navigator.serviceWorker.register(
        getServiceWorkerUrl(),
        { scope: "/" },
    );

    const serviceWorkerRegistration = await navigator.serviceWorker.ready;

    const { getToken } = await import("firebase/messaging");
    const token = await getToken(messaging, {
        vapidKey: String(config.FIREBASE_VAPID_KEY),
        serviceWorkerRegistration,
    });

    return token || null;
};

const registerFirebaseDeviceInternal = async ({
    requestPermission = true,
}: RegisterFirebaseDeviceOptions = {}): Promise<boolean> => {
    const messaging = await getMessagingClient();
    if (!messaging) {
        return false;
    }

    const permission =
        Notification.permission === "granted"
            ? "granted"
            : requestPermission
              ? await Notification.requestPermission()
              : Notification.permission;
    if (permission !== "granted") {
        return false;
    }

    const token = await getFirebaseToken(messaging);
    if (!token) {
        return false;
    }

    if (!foregroundListenerRegistered) {
        const { onMessage } = await import("firebase/messaging");
        onMessage(messaging, (payload) => {
            const title =
                payload.notification?.title || payload.data?.title || "BFlow";
            const body = payload.notification?.body || payload.data?.body || "";

            if (Notification.permission === "granted") {
                new Notification(title, {
                    body,
                    icon: "/bimi.svg",
                });
            }
        });
        foregroundListenerRegistered = true;
    }

    await registerDeviceToken(token);
    return true;
};

/** Registers the current browser with the backend for FCM delivery. */
export const registerFirebaseDevice = (
    options: RegisterFirebaseDeviceOptions = {},
): Promise<boolean> => {
    if (registrationInFlight) {
        return registrationInFlight;
    }

    registrationInFlight = registerFirebaseDeviceInternal(options).finally(() => {
        registrationInFlight = null;
    });

    return registrationInFlight;
};

/** Removes the current browser token from the backend before signing out. */
export const unregisterFirebaseDevice = async (): Promise<boolean> => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") {
        return false;
    }

    if (registrationInFlight) {
        await registrationInFlight.catch(() => false);
    }

    const messaging = await getMessagingClient();
    if (!messaging) {
        return false;
    }

    const token = await getFirebaseToken(messaging);
    if (!token) {
        return false;
    }

    await unregisterDeviceToken(token);

    try {
        const { deleteToken } = await import("firebase/messaging");
        await deleteToken(messaging);
    } catch (error) {
        console.warn("[FCM] No se pudo eliminar el token local", error);
    }

    return true;
};
