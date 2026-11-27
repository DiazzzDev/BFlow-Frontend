import { describe, expect, it, vi } from "vitest";

const request = vi.hoisted(() => vi.fn());
vi.mock("@/auth/cognito/client", () => ({ cognitoRequest: request }));
vi.mock("@/auth/cognito/oidc", () => ({ getCognitoTokens: vi.fn() }));
vi.mock("@/config/config", () => ({ config: { COGNITO_SELF_SERVICE_MFA_ENABLED: false } }));

describe("MFA availability", () => {
    it("does not issue a Cognito request when self-service MFA is disabled", async () => {
        const { setUpTotp } = await import("@/auth/cognito/mfa");
        await expect(setUpTotp()).rejects.toThrow("MFA self-service is not enabled");
        expect(request).not.toHaveBeenCalled();
    });
});
