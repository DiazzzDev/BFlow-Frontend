/* global firebase, importScripts, URL, self */

importScripts(
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js",
);

const params = new URL(self.location.href).searchParams;
const firebaseConfig = {
    apiKey: params.get("apiKey") || "",
    authDomain: params.get("authDomain") || "",
    projectId: params.get("projectId") || "",
    storageBucket: params.get("storageBucket") || "",
    messagingSenderId: params.get("messagingSenderId") || "",
    appId: params.get("appId") || "",
};

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

if (Object.values(firebaseConfig).every(Boolean)) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        const title = payload.notification?.title || payload.data?.title || "BFlow";
        const body = payload.notification?.body || payload.data?.body || "";

        self.registration.showNotification(title, {
            body,
            icon: "/bimi.svg",
            data: payload.data || {},
        });
    });
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                const existingClient = clientList.find((client) => "focus" in client);
                return existingClient
                    ? existingClient.focus()
                    : self.clients.openWindow("/");
            }),
    );
});
