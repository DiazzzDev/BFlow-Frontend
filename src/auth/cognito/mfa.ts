import { cognitoRequest } from "./client";
import { getCognitoTokens } from "./oidc";
import { config } from "@/config/config";

export type TotpSetup = { sharedSecret: string; getSetupUri: (issuer: string, accountName?: string) => URL };

const accessToken = async () => {
    if (!config.COGNITO_SELF_SERVICE_MFA_ENABLED) {
        throw new Error("MFA self-service is not enabled for this Cognito client.");
    }
    const tokens = await getCognitoTokens();
    if (!tokens) throw new Error("No active Cognito session.");
    return tokens.accessToken;
};

export const fetchMfaPreference = async () => {
    const result = await cognitoRequest<{ UserMFASettingList?: string[] }>("GetUser", { AccessToken: await accessToken() });
    return { enabled: result.UserMFASettingList ?? [] };
};

export const setUpTotp = async (): Promise<TotpSetup> => {
    const result = await cognitoRequest<{ SecretCode?: string }>("AssociateSoftwareToken", { AccessToken: await accessToken() });
    if (!result.SecretCode) throw new Error("Cognito did not return a TOTP secret.");
    return { sharedSecret: result.SecretCode, getSetupUri: (issuer, accountName = "") => new URL(`otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?${new URLSearchParams({ secret: result.SecretCode!, issuer }).toString()}`) };
};

export const verifyAndEnableTotp = async (code: string) => {
    const token = await accessToken();
    await cognitoRequest("VerifySoftwareToken", { AccessToken: token, UserCode: code });
    await cognitoRequest("SetUserMFAPreference", { AccessToken: token, SoftwareTokenMfaSettings: { Enabled: true, PreferredMfa: true } });
};
