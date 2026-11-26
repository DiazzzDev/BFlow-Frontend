import { beforeEach, describe, expect, it } from "vitest";

import {
    confirmPendingLoginMethod,
    getLastUsedLoginMethod,
    markPendingLoginMethod,
} from "@/auth/utils/lastUsedLoginMethod";

describe("last used login method", () => {
    beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

    it("does not mark Google as last used when redirect was only initiated", () => {
        markPendingLoginMethod("Google");
        expect(getLastUsedLoginMethod()).toBeNull();
    });

    it("marks Google only after the OAuth callback has completed", () => {
        markPendingLoginMethod("Google");
        confirmPendingLoginMethod();
        expect(getLastUsedLoginMethod()).toBe("Google");
    });
});
