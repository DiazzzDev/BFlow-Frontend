import { beforeEach, describe, expect, it, vi } from "vitest";
const request = vi.hoisted(() => vi.fn()); const tokens = vi.hoisted(() => vi.fn());
vi.mock("@/auth/cognito/client", () => ({ cognitoRequest: request }));
vi.mock("@/auth/cognito/oidc", () => ({ getCognitoTokens: tokens }));
vi.mock("@/config/config", () => ({ config: { COGNITO_SELF_SERVICE_MFA_ENABLED: true } }));
describe("Cognito TOTP", () => {
    beforeEach(() => { vi.clearAllMocks(); tokens.mockResolvedValue({ accessToken: "access" }); });
    it("associates, verifies, then enables the Cognito software token", async () => {
        request.mockResolvedValueOnce({ SecretCode: "ABC123" }).mockResolvedValueOnce({ Status: "SUCCESS" }).mockResolvedValueOnce({});
        const { setUpTotp, verifyAndEnableTotp } = await import("@/auth/cognito/mfa"); const setup = await setUpTotp(); expect(setup.sharedSecret).toBe("ABC123"); await verifyAndEnableTotp("123456");
        expect(request).toHaveBeenNthCalledWith(2, "VerifySoftwareToken", { AccessToken: "access", UserCode: "123456" });
        expect(request).toHaveBeenNthCalledWith(3, "SetUserMFAPreference", { AccessToken: "access", SoftwareTokenMfaSettings: { Enabled: true, PreferredMfa: true } });
    });

    it("reports the configured Cognito MFA methods without inventing device names", async () => {
        request.mockResolvedValueOnce({ UserMFASettingList: ["SOFTWARE_TOKEN_MFA"] });
        const { fetchMfaPreference } = await import("@/auth/cognito/mfa");
        await expect(fetchMfaPreference()).resolves.toEqual({ enabled: ["SOFTWARE_TOKEN_MFA"] });
        expect(request).toHaveBeenCalledWith("GetUser", { AccessToken: "access" });
    });
});
