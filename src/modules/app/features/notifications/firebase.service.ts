import type { Messaging } from "firebase/messaging";

import { registerDeviceToken } from "./notifications.service";

import { config } from "@/config/config";

const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
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

const registerFirebaseDeviceInternal = async (): Promise<boolean> => {
    const messaging = await getMessagingClient();
    if (!messaging) {
        return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        return false;
    }

    await navigator.serviceWorker.register(
        getServiceWorkerUrl(),
        { scope: "/" },
    );

    const serviceWorkerRegistration = await navigator.serviceWorker.ready;

    const { getToken } = await import("firebase/messaging");
    const token = await getToken(messaging, {
        vapidKey: config.FIREBASE_VAPID_KEY,
        serviceWorkerRegistration,
    });

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
export const registerFirebaseDevice = (): Promise<boolean> => {
    if (registrationInFlight) {
        return registrationInFlight;
    }

    registrationInFlight = registerFirebaseDeviceInternal().finally(() => {
        registrationInFlight = null;
    });

    return registrationInFlight;
};
