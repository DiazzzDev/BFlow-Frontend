import { User } from "oidc-client-ts";

export class AuthenticationFacade {

    static getAccessToken(
        user: User | null
    ) {
        return user?.access_token;
    }

    static getIdToken(
        user: User | null
    ) {
        return user?.id_token;
    }

    static getRefreshToken(
        user: User | null
    ) {
        return user?.refresh_token;
    }

}