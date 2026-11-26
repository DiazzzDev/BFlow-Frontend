import { beforeEach, describe, expect, it, vi } from "vitest";

const configured = vi.hoisted(() => ({
    COGNITO_DOMAIN: "https://auth.example.test",
    COGNITO_CLIENT_ID: "client-id",
    VITE_COGNITO_REDIRECT_SIGN_IN: "http://localhost:5173/auth/callback",
    VITE_COGNITO_REDIRECT_SIGN_OUT: "http://localhost:5173/auth/login",
    VITE_COGNITO_USER_POOL_ID: "us-east-1_pool",
    COGNITO_ISSUER: "",
    API_BASE_URL: "",
    MCP_SERVER_URL: "",
    COGNITO_SELF_SERVICE_MFA_ENABLED: false,
}));

vi.mock("@/config/config", () => ({ config: configured }));

const storage = () => {
    const values = new Map<string, string>();
    return {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => { values.set(key, value); },
        removeItem: (key: string) => { values.delete(key); },
    };
};

describe("Cognito PKCE callback", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.stubGlobal("sessionStorage", storage());
        vi.stubGlobal("localStorage", storage());
        vi.stubGlobal("window", { location: { search: "" } });
    });

    it("does not consume a PKCE transaction when callback state is invalid", async () => {
        sessionStorage.setItem("bflow.oidc.state", "expected-state");
        sessionStorage.setItem("bflow.oidc.verifier", "verifier");
        window.location.search = "?code=authorization-code&state=wrong-state";
        const { exchangeAuthorizationCode } = await import("@/auth/cognito/oidc");

        await expect(exchangeAuthorizationCode()).rejects.toThrow("Invalid Cognito callback");
        expect(sessionStorage.getItem("bflow.oidc.state")).toBe("expected-state");
        expect(sessionStorage.getItem("bflow.oidc.verifier")).toBe("verifier");
    });

    it("does not request the administrative Cognito scope until MFA self-service is enabled", async () => {
        let assignedUrl = "";
        vi.stubGlobal("window", { location: { search: "", assign: (url: string) => { assignedUrl = url; } } });
        const { beginAuthorization } = await import("@/auth/cognito/oidc");

        await beginAuthorization("Google");
        expect(new URL(assignedUrl).searchParams.get("scope")).toBe("openid email profile");
    });

    it("exchanges a matching callback and stores Cognito tokens", async () => {
        sessionStorage.setItem("bflow.oidc.state", "expected-state");
        sessionStorage.setItem("bflow.oidc.verifier", "verifier");
        window.location.search = "?code=authorization-code&state=expected-state";
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "access", id_token: "id", refresh_token: "refresh" }) }));
        const { exchangeAuthorizationCode } = await import("@/auth/cognito/oidc");

        await expect(exchangeAuthorizationCode()).resolves.toEqual({ accessToken: "access", idToken: "id", refreshToken: "refresh" });
        expect(sessionStorage.getItem("bflow.oidc.state")).toBeNull();
        expect(sessionStorage.getItem("bflow.oidc.verifier")).toBeNull();
        expect(sessionStorage.getItem("bflow.oidc.tokens")).toContain("access");
        expect(localStorage.getItem("bflow.oidc.transaction")).toBeNull();
    });

    it("recovers a short-lived PKCE transaction when Cognito returns in a new tab", async () => {
        localStorage.setItem("bflow.oidc.transaction", JSON.stringify({ state: "state", verifier: "verifier", createdAt: Date.now() }));
        window.location.search = "?code=authorization-code&state=state";
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "access", id_token: "id" }) }));
        const { exchangeAuthorizationCode } = await import("@/auth/cognito/oidc");

        await expect(exchangeAuthorizationCode()).resolves.toMatchObject({ accessToken: "access", idToken: "id" });
    });
});
