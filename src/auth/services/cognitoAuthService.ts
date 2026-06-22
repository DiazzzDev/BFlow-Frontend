import { cognitoConfig } from "../cognito/config";

export interface CognitoTokenResponse {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export class CognitoAuthService {

    async exchangeCodeForTokens(
        code: string,
        codeVerifier: string
    ): Promise<CognitoTokenResponse> {

        const body = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: cognitoConfig.client_id,
            code,
            redirect_uri: cognitoConfig.redirect_uri,
            code_verifier: codeVerifier
        });

        const response = await fetch(
            "https://us-east-1m6tn3h360.auth.us-east-1.amazoncognito.com/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body
            }
        );

        if (!response.ok) {
            throw new Error("Token exchange failed");
        }

        const data = await response.json() as CognitoTokenResponse;

        return data;
    }

}

export const cognitoAuthService = new CognitoAuthService();