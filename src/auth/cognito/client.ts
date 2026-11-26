import { config } from "@/config/config";

type CognitoErrorPayload = { __type?: string; message?: string };

const endpoint = () => {
    const [region] = config.VITE_COGNITO_USER_POOL_ID.split("_");
    if (!region || !config.VITE_COGNITO_USER_POOL_ID.includes("_")) throw new Error("VITE_COGNITO_USER_POOL_ID must include its AWS region.");
    return `https://cognito-idp.${region}.amazonaws.com/`;
};

export const cognitoRequest = async <T>(target: string, body: Record<string, unknown>): Promise<T> => {
    const response = await fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/x-amz-json-1.1", "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}` }, body: JSON.stringify(body) });
    if (!response.ok) {
        const error = await response.json().catch(() => ({})) as CognitoErrorPayload;
        const failure = new Error(error.message ?? "Cognito request failed.");
        failure.name = error.__type?.split("#").pop() ?? "CognitoRequestError";
        throw failure;
    }
    return response.json() as Promise<T>;
};
