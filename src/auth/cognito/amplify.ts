import { Amplify } from "aws-amplify";

import { config } from "@/api/config";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: config.VITE_COGNITO_USER_POOL_ID,
            userPoolClientId: config.COGNITO_CLIENT_ID,
            loginWith: {
                email: true,

                oauth: {
                    domain: config.COGNITO_DOMAIN.replace("https://", ""),
                    scopes: ["openid", "email", "profile"],
                    redirectSignIn: [config.VITE_COGNITO_REDIRECT_SIGN_IN],
                    redirectSignOut: [config.VITE_COGNITO_REDIRECT_SIGN_OUT],
                    responseType: "code",
                },
            },
        },
    },
});