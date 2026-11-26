import { beforeEach, describe, expect, it, vi } from "vitest";
const cognito = vi.hoisted(() => ({ request: vi.fn() }));
const oidc = vi.hoisted(() => ({ getTokens: vi.fn(), federated: vi.fn(), claims: vi.fn() }));
vi.mock("@/auth/cognito/client", () => ({ cognitoRequest: cognito.request }));
vi.mock("@/auth/cognito/oidc", () => ({ beginAuthorization: vi.fn(), beginHostedPage: vi.fn(), beginLogout: vi.fn(), getCognitoTokens: oidc.getTokens, getIdTokenClaims: oidc.claims, isFederatedIdentity: oidc.federated }));
describe("auth service", () => {
    beforeEach(() => { localStorage.clear(); sessionStorage.clear(); vi.clearAllMocks(); });
    it("blocks the fourth recovery request before it reaches Cognito", async () => {
        cognito.request.mockResolvedValue({}); const { authService } = await import("@/auth/services/authService");
        await authService.forgotPassword("person@example.com"); await authService.forgotPassword("person@example.com"); await authService.forgotPassword("person@example.com");
        await expect(authService.forgotPassword("person@example.com")).rejects.toMatchObject({ name: "EmailActionRateLimitError" });
        expect(cognito.request).toHaveBeenCalledTimes(3);
        expect(cognito.request).toHaveBeenCalledWith("ForgotPassword", expect.objectContaining({ Username: "person@example.com" }));
    });
    it("does not expose password changes to a federated user", async () => {
        oidc.getTokens.mockResolvedValue({ accessToken: "access", idToken: "id" }); oidc.federated.mockReturnValue(true);
        const { authService } = await import("@/auth/services/authService");
        await expect(authService.canChangePassword()).resolves.toBe(false); await expect(authService.changePassword("old", "new")).rejects.toThrow("Federated users");
        expect(cognito.request).not.toHaveBeenCalled();
    });
    it("changes a local Cognito password with its access token", async () => {
        oidc.getTokens.mockResolvedValue({ accessToken: "access", idToken: "id" }); oidc.federated.mockReturnValue(false); cognito.request.mockResolvedValue({});
        const { authService } = await import("@/auth/services/authService"); await authService.changePassword("old", "new");
        expect(cognito.request).toHaveBeenCalledWith("ChangePassword", { AccessToken: "access", PreviousPassword: "old", ProposedPassword: "new" });
    });
});
