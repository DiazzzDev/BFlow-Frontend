import { config } from "@/api/config";

export const cognitoConfig = {

    authority:
        config.COGNITO_ISSUER,

    metadata: {

        issuer:
            config.COGNITO_ISSUER,

        authorization_endpoint:
            `${config.COGNITO_DOMAIN}/oauth2/authorize`,

        token_endpoint:
            `${config.COGNITO_DOMAIN}/oauth2/token`,

        userinfo_endpoint:
            `${config.COGNITO_DOMAIN}/oauth2/userInfo`,

        jwks_uri:
            `${config.COGNITO_ISSUER}/.well-known/jwks.json`,

        end_session_endpoint:
            `${config.COGNITO_DOMAIN}/logout`
    },

    client_id:
        config.COGNITO_CLIENT_ID,

    redirect_uri:
        `${window.location.origin}/auth/callback`,

    post_logout_redirect_uri:
        `${window.location.origin}/auth/login`,

    response_type:
        "code",

    scope:
        "openid email profile",
};