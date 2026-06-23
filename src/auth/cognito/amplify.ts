import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "us-east-1_M6tN3H360",
            userPoolClientId: "ijaq5ej2a05pjerccifrrscaa",
            loginWith: {
                email: true,
            },
        },
    },
});