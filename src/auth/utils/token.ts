import { User } from "oidc-client-ts";

export const getAccessToken = (): string | null => {
    const oidcKey = Object.keys(localStorage).find(key =>
        key.startsWith("oidc.user:")
    );

    if (!oidcKey) {
        return null;
    }

    const rawUser = localStorage.getItem(oidcKey);

    if (!rawUser) {
        return null;
    }

    const user = User.fromStorageString(rawUser);

    return user.access_token;
};